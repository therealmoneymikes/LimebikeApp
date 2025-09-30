









""" 
    FastAPI Depends Wrappers 
    @field_validator("details", "langs")
    @classmethod
    def no_html_allowed(cls, v: str) -> str:
        if isinstance(v, list):
            for lang in v:
                if lang:
                    if bool(re.compile(r"<[^>]+>").search(lang)):
                        raise ValueError("HTML content is not allowed in this field")
        else:
            if v:
                if bool(re.compile(r"<[^>]+>").search(lang)):
                    raise ValueError("HTML content is not allowed in this field")
        return v 
"""