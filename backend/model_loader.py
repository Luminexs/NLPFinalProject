import os
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch

class ModelLoader:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelLoader, cls).__new__(cls)
            cls._instance._load_model()
        return cls._instance

    def _load_model(self):
        model_path = os.path.join(os.path.dirname(__file__), "model")
        print(f"Loading model from {model_path}...")
        
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_path)
        
        # Set to evaluation mode
        self.model.eval()
        
        # Move to GPU if available
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)
        print(f"Model loaded on {self.device}")

    def get_model_and_tokenizer(self):
        return self.model, self.tokenizer, self.device

# Singleton instance
model_loader = ModelLoader()
