from pydantic import BaseModel, ConfigDict, Field, model_validator
from typing import Literal
class LabValue(BaseModel):
    """
    Represents one user-reviewed lab result.

    Aliases allow the React frontend to send camelCase field names
    while Python code uses readable snake_case names.
    """

    model_config = ConfigDict(populate_by_name=True)

    test_name: str = Field(
        alias="testName",
        min_length=1,
        max_length=100,
    )
    value: float = Field(ge=0)
    unit: str = Field(
        min_length=1,
        max_length=30,
    )
    low_range: float | None = Field(
        default=None,
        alias="lowRange",
        ge=0,
    )
    high_range: float | None = Field(
        default=None,
        alias="highRange",
        ge=0,
    )

    @model_validator(mode="after")
    def validate_reference_range(self):
        """Ensures the lower range is smaller than the upper range."""
        if (
            self.low_range is not None
            and self.high_range is not None
            and self.low_range >= self.high_range
        ):
            raise ValueError(
                "Lower reference range must be smaller than upper reference range."
            )

        return self


class VerifiedLabValuesRequest(BaseModel):
    """Represents a reviewed collection of lab values ready for later analysis."""

    values: list[LabValue] = Field(
        min_length=1,
        max_length=100,
    )

    @model_validator(mode="after")
    def validate_no_duplicate_test_names(self):
        """
        Rejects requests where the same test appears more than once
        (case-insensitive, ignoring extra spacing). This mirrors the
        frontend check, but must also be enforced here because any
        client could call this API directly and bypass the browser
        validation entirely.
        """
        seen_test_names = set()

        for lab_value in self.values:
            normalized_name = lab_value.test_name.strip().lower()

            if normalized_name in seen_test_names:
                raise ValueError(
                    f'Duplicate test name found: "{lab_value.test_name}". '
                    "Each test must appear only once per request."
                )

            seen_test_names.add(normalized_name)

        return self

    
class AnalyzedLabValue(LabValue):
    """Represents one lab value after transparent range classification."""

    status: Literal["low", "normal", "high", "unknown"]
    analysis_note: str = Field(alias="analysisNote")