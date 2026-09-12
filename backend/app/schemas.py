from pydantic import BaseModel, ConfigDict, Field, model_validator


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
    value: float
    unit: str = Field(
        min_length=1,
        max_length=30,
    )
    low_range: float | None = Field(
        default=None,
        alias="lowRange",
    )
    high_range: float | None = Field(
        default=None,
        alias="highRange",
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