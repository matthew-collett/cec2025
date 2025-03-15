class QueryBuilder:
    def __init__(self):
        self.select_clause = "SELECT *"
        self.from_clause = " FROM c"
        self.where_clause = ""

    def select(self, fields):
        if fields:
            ready_fields = ['c.' + s for s in fields]
            self.select_clause = f"SELECT {', '.join(ready_fields)}"
        return self

    def where(self, condition, value):
        if condition is not None and condition != '': # Sanity Check
            condition = 'c.' + condition
        else:
            return self
        if not self.where_clause:
            self.where_clause = f" WHERE {condition} = '{value}'"
        else:
            self.where_clause += " AND " + f"{condition} = '{value}'"
        return self

    def build(self):
        query = f"{self.select_clause}{self.from_clause}{self.where_clause}"
        return query
