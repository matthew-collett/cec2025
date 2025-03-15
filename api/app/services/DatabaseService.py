from azure.cosmos import CosmosClient, exceptions
import os


class DatabaseService:
    def __init__(self):
        connection_string = os.getenv('CONNECTION_STRING')
        database_id = 'CEC-2025'
        self.client = CosmosClient.from_connection_string(connection_string)
        self.database = self.client.get_database_client(database_id)

    def upsert_item(self, item, container_id):
        try:
            container = self.database.get_container_client(container_id)
            response = container.upsert_item(item)
            return response
        except exceptions.CosmosHttpResponseError as e:
            print(f'An error occurred: {e}')
            return None

    def read_item(self, item_id, partition_key, container_id):
        try:
            container = self.database.get_container_client(container_id)
            response = container.read_item(
                item=item_id, partition_key=partition_key)
            return response
        except exceptions.CosmosHttpResponseError as e:
            print(f'An error occurred: {e}')
            return None

    def delete_item(self, item_id, partition_key, container_id):
        try:
            container = self.database.get_container_client(container_id)
            response = container.delete_item(
                item=item_id, partition_key=partition_key)
            return response
        except exceptions.CosmosHttpResponseError as e:
            print(f'An error occurred: {e}')
            return None

    def query_items(self, query, container_id):
        try:
            container = self.database.get_container_client(container_id)
            items = list(container.query_items(
                query=query, enable_cross_partition_query=True))
            return items
        except exceptions.CosmosHttpResponseError as e:
            print(f'An error occurred: {e}')
            return None

    def get_item(self, query, container_id):
        try:
            container = self.database.get_container_client(container_id)
            items = container.query_items(
                query=query, enable_cross_partition_query=True)
            first_item = next(items, None)  # First item, if no items then None
            return first_item
        except exceptions.CosmosHttpResponseError as e:
            print(f'An error occurred: {e}')
            return None
