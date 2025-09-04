
export interface UploadedImage {
  base64: string;
  mimeType: string;
}

export interface Scene {
  id: string;
  name: string;
  prompt: string;
  imageUrl: string;
}
