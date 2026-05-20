import torch
import torch.nn.functional as F
from model_loader import model_loader

def predict_review(text: str):
    model, tokenizer, device = model_loader.get_model_and_tokenizer()
    
    # Tokenize input
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=512
    ).to(device)
    
    # Run inference
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probabilities = F.softmax(logits, dim=1).squeeze()
        
    # Get prediction
    conf, label_idx = torch.max(probabilities, dim=0)
    
    # Map index to label (0: REAL, 1: FAKE)
    labels = ["REAL", "FAKE"]
    label = labels[label_idx.item()]
    
    return {
        "label": label,
        "confidence": float(conf.item()),
        "probabilities": {
            "real": float(probabilities[0].item()),
            "fake": float(probabilities[1].item())
        }
    }
