from app import app, db
from flask import request, jsonify, send_from_directory, url_for
from models import Friend, Document
import os
import uuid
from werkzeug.utils import secure_filename

# Get all friends
@app.route("/api/friends", methods=["GET"])
def get_friends():
    friends = Friend.query.all()
    result = [friend.to_json() for friend in friends]
    return jsonify(result)

# Create a friend
@app.route("/api/friends", methods=["POST"])
def create_friend():
    try:
        data = request.json
        
        required_fields = ["name", "role", "gender"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f'Missing required field: "{field}"'}), 400
        
        name = data.get("name")
        role = data.get("role")
        gender = data.get("gender")
        
        # Fetch avatar image based on gender
        if gender == "male":
            img_url = f"https://avatar.iran.liara.run/public/boy?username={name}"
        elif gender == "female":
            img_url = f"https://avatar.iran.liara.run/public/girl?username={name}"
        else: 
            img_url = None
            
        new_friend = Friend(name=name, role=role, gender=gender, img_url=img_url)
            
        db.session.add(new_friend)
        db.session.commit()
        
        return jsonify({"msg": "Friend added successfully"}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
# Delete a friend 
@app.route("/api/friends/<int:id>", methods=['DELETE'])
def delete_friend(id):
    try:
        friend = Friend.query.get(id)
        if friend is None:
            return jsonify({"error": "Friend not found"}), 404
        
        db.session.delete(friend)
        db.session.commit()
        return jsonify({"msg": "Friend deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
# Update a friend 
@app.route("/api/friends/<int:id>", methods=['PATCH'])
def update_friend(id):
    try:
        friend = Friend.query.get(id)
        if friend is None:
            return jsonify({"error": "Friend not found"}), 404
        
        data = request.json
        
        friend.name = data.get("name", friend.name)
        friend.role = data.get("role", friend.role)
        friend.gender = data.get("gender", friend.gender)
        
        db.session.commit()
        return jsonify(friend.to_json()), 200
            
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Helper function to check allowed file extensions
def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'xlsx', 'xls', 'ppt', 'pptx'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Get all documents
@app.route("/api/documents", methods=["GET"])
def get_documents():
    documents = Document.query.order_by(Document.upload_date.desc()).all()
    result = [doc.to_json() for doc in documents]
    return jsonify(result)

# Upload a document
@app.route("/api/documents", methods=["POST"])
def upload_document():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
            
        file = request.files['file']
        description = request.form.get('description', '')
        
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
            
        if file and allowed_file(file.filename):
            original_filename = secure_filename(file.filename)
            file_extension = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else ''
            unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
            
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            file.save(file_path)
            
            file_size = os.path.getsize(file_path)
            file_type = file.content_type
            
            new_document = Document(
                filename=unique_filename,
                original_filename=original_filename,
                file_path=file_path,
                file_type=file_type,
                file_size=file_size,
                description=description
            )
            
            db.session.add(new_document)
            db.session.commit()
            
            return jsonify(new_document.to_json()), 201
        else:
            return jsonify({"error": "File type not allowed"}), 400
            
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Download a document
@app.route("/api/documents/<int:id>/download", methods=["GET"])
def download_document(id):
    try:
        document = Document.query.get(id)
        if document is None:
            return jsonify({"error": "Document not found"}), 404
            
        return send_from_directory(
            directory=os.path.dirname(document.file_path),
            path=os.path.basename(document.file_path),
            as_attachment=True,
            download_name=document.original_filename
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete a document
@app.route("/api/documents/<int:id>", methods=["DELETE"])
def delete_document(id):
    try:
        document = Document.query.get(id)
        if document is None:
            return jsonify({"error": "Document not found"}), 404
            
        # Delete the file from the filesystem
        if os.path.exists(document.file_path):
            os.remove(document.file_path)
            
        db.session.delete(document)
        db.session.commit()
        
        return jsonify({"msg": "Document deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500