from app import db
from datetime import datetime

class Friend(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100), nullable = False)
    role = db.Column(db.String(50), nullable = False)
    gender = db.Column(db.String(10), nullable = False)
    img_url = db.Column(db.String(200), nullable = True)
    
    
    def to_json(self):
        return {
            "id":self.id,
            "name":self.name,
            "role":self.role,
            "gender":self.gender,
            "imgUrl":self.img_url
        }

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    file_type = db.Column(db.String(100), nullable=False)
    file_size = db.Column(db.Integer, nullable=False)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.Text, nullable=True)
    
    def to_json(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "originalFilename": self.original_filename,
            "fileType": self.file_type,
            "fileSize": self.file_size,
            "uploadDate": self.upload_date.strftime("%Y-%m-%d %H:%M:%S"),
            "description": self.description
        }

