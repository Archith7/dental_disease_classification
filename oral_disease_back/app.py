


import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms as T
from PIL import Image
import io
import numpy as np
import cv2
from flask import Flask, request, jsonify, send_file
import timm  
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = timm.create_model("rexnet_150", pretrained=False, num_classes=3)
model.to(device)
# state_dict = torch.load("C:/Users/marpa/Desktop/model/oral_best_model.pth", map_location=device)
state_dict = torch.load("./models/oral_best_model.pth", map_location=device)
model.load_state_dict(state_dict)
model.eval()

mean = [0.485, 0.456, 0.406]
std = [0.229, 0.224, 0.225]
im_size = 224

transform = T.Compose([
    T.Resize((im_size, im_size)),
    T.ToTensor(),
    T.Normalize(mean=mean, std=std)
])

class_labels = ["Calculus", "Gingivitis", "Hypodontia"]
num_classes = len(class_labels)

feature_maps = None
gradients = None

def feature_hook(module, input, output):
    global feature_maps
    feature_maps = output

def backward_hook(module, grad_input, grad_output):
    global gradients
    gradients = grad_output[0]

conv_layer = model.features[-1]  
conv_layer.register_forward_hook(feature_hook)
conv_layer.register_full_backward_hook(backward_hook)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        image = Image.open(file).convert("RGB")
        image_tensor = transform(image).unsqueeze(0).to(device)

        with torch.no_grad():
            output = model(image_tensor)
            probabilities = F.softmax(output, dim=1)

        probs = {class_labels[i]: round(float(probabilities[0][i].item()) * 100, 2) for i in range(num_classes)}
        predicted_class = class_labels[torch.argmax(probabilities, dim=1).item()]

        return jsonify({"prediction": predicted_class, "confidence": probs})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def generate_cam(image_tensor):
    global feature_maps, gradients

    image_tensor.requires_grad = True
    output = model(image_tensor)
    pred_class = torch.argmax(output, dim=1)
    model.zero_grad()
    output[0, pred_class].backward()

    pooled_gradients = torch.mean(gradients, dim=[0, 2, 3])
    cam = torch.sum(pooled_gradients[None, :, None, None] * feature_maps, dim=1).squeeze()
    cam = cam.cpu().detach().numpy()
    cam = cv2.resize(cam, (im_size, im_size))
    cam = np.maximum(cam, 0)
    cam = (cam - cam.min()) / (cam.max() - cam.min())
    heatmap = cv2.applyColorMap(np.uint8(255 * cam), cv2.COLORMAP_JET)
    heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)
    return Image.fromarray(heatmap)

def getCAM(image_tensor, class_idx):
    with torch.no_grad():
        output = model(image_tensor)
    
    params = list(model.parameters())[-2]
    weight_fc = params[class_idx].cpu().detach().numpy()
    feature_map = feature_maps.cpu().detach().numpy()[0]
    
    cam = np.dot(weight_fc, feature_map.reshape(feature_map.shape[0], -1)).reshape(feature_map.shape[1:])
    cam = cv2.resize(cam, (im_size, im_size))
    cam = np.maximum(cam, 0)
    cam = (cam - cam.min()) / (cam.max() - cam.min())
    
    heatmap = cv2.applyColorMap(np.uint8(255 * cam), cv2.COLORMAP_JET)
    heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)
    img = np.array(image_tensor.cpu().squeeze().permute(1, 2, 0) * std + mean) * 255
    img = np.clip(img, 0, 255).astype(np.uint8)
    overlay = cv2.addWeighted(img, 0.6, heatmap, 0.4, 0)
    return Image.fromarray(overlay)

@app.route("/generate-cam", methods=["POST"])
def generate_cam_endpoint():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        image = Image.open(file).convert("RGB")
        image_tensor = transform(image).unsqueeze(0).to(device)
        cam_image = generate_cam(image_tensor)
        
        img_io = io.BytesIO()
        cam_image.save(img_io, format="PNG")
        img_io.seek(0)
        return send_file(img_io, mimetype="image/png")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get-cam", methods=["POST"])
def get_cam_endpoint():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        image = Image.open(file).convert("RGB")
        image_tensor = transform(image).unsqueeze(0).to(device)
        
        with torch.no_grad():
            output = model(image_tensor)
            class_idx = torch.argmax(output, dim=1).item()
        
        cam_image = getCAM(image_tensor, class_idx)
        
        img_io = io.BytesIO()
        cam_image.save(img_io, format="PNG")
        img_io.seek(0)
        return send_file(img_io, mimetype="image/png")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
