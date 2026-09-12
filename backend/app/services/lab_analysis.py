from app.schemas import AnalyzedLabValue, LabValue


def classify_lab_value(lab_value: LabValue) -> str:
    """
    Classifies a result using only the user-provided laboratory reference range.

    This function does not diagnose a condition or infer a medical cause.
    """

    # The app cannot classify a result without both range boundaries.
    if lab_value.low_range is None or lab_value.high_range is None:
        return "unknown"

    # A value below the lower boundary is classified as low.
    if lab_value.value < lab_value.low_range:
        return "low"

    # A value above the upper boundary is classified as high.
    if lab_value.value > lab_value.high_range:
        return "high"

    # A value inside the supplied range is classified as normal.
    return "normal"


def build_analysis_note(lab_value: LabValue, status: str) -> str:
    """Creates a transparent explanation of the range comparison."""

    # Missing range data means the app must explain why no status was assigned.
    if status == "unknown":
        return (
            "A complete reference range was not provided, so this result "
            "cannot be classified by the app."
        )

    # The note exposes the exact lower-bound comparison used by the app.
    if status == "low":
        return (
            f"{lab_value.value} {lab_value.unit} is below the supplied lower "
            f"reference range of {lab_value.low_range} {lab_value.unit}."
        )

    # The note exposes the exact upper-bound comparison used by the app.
    if status == "high":
        return (
            f"{lab_value.value} {lab_value.unit} is above the supplied upper "
            f"reference range of {lab_value.high_range} {lab_value.unit}."
        )

    # The normal result message includes the full range for user review.
    return (
        f"{lab_value.value} {lab_value.unit} is within the supplied reference "
        f"range of {lab_value.low_range} to {lab_value.high_range} "
        f"{lab_value.unit}."
    )


def analyze_lab_value(lab_value: LabValue) -> AnalyzedLabValue:
    """Returns one range classification and its readable explanation."""

    # First calculate the machine-readable status.
    status = classify_lab_value(lab_value)

    # Then return both the original value and the transparent explanation.
    return AnalyzedLabValue(
        test_name=lab_value.test_name,
        value=lab_value.value,
        unit=lab_value.unit,
        low_range=lab_value.low_range,
        high_range=lab_value.high_range,
        status=status,
        analysis_note=build_analysis_note(lab_value, status),
    )