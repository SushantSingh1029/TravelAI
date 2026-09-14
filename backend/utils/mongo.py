def serialize_doc(doc):
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

def serialize_docs(docs):
    return [serialize_doc(doc) for doc in docs]
