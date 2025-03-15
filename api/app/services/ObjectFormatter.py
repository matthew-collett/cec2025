import json

REMOVE = ["_attachments", "_etag", "_rid", "_ts", "_self"]

def format_objects(input_data):
    for item in input_data:
        for attr in REMOVE:
            if attr in item:
                del item[attr]
    return input_data

def format_object(input_data):
    for attr in REMOVE:
        if attr in input_data:
            del input_data[attr]
    return input_data