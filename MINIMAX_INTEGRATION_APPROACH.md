# Minimax Integration Approach

## Overview
This document outlines the approach for integrating Minimax as an alternative AI service for creative generation in the platform. Minimax is a Chinese AI company that provides text-to-image and other AI services.

## Current Implementation
The current creative generation implementation uses:
1. OpenAI (DALL-E 3) for high-quality image generation
2. Replicate (FLUX-Schnell) for cost-effective image generation

## Proposed Minimax Integration

### 1. API Configuration
Add Minimax to the API configuration:

```typescript
const API_CONFIGS: Record<string, APIConfig> = {
  openai: { name: 'OpenAI', costPerImage: 0.04, maxImagesPerBatch: 10, supportsVideo: false, quality: 'high' },
  replicate: { name: 'Replicate', costPerImage: 0.008, maxImagesPerBatch: 50, supportsVideo: true, quality: 'medium' },
  minimax: { name: 'Minimax', costPerImage: 0.015, maxImagesPerBatch: 20, supportsVideo: false, quality: 'high' }
};
```

### 2. API Selection Logic
Update the API selection logic to include Minimax:

```typescript
function selectOptimalAPI(requestCount: number, budget: number = 100, quality: 'high' | 'medium' | 'low' = 'medium'): string {
  if (quality === 'high' || requestCount <= 5) return 'openai';
  if (requestCount > 20 && budget < 50) return 'replicate';
  // Add Minimax as an option for high quality at moderate cost
  if (quality === 'high' && budget < 80) return 'minimax';
  return requestCount > 10 ? 'replicate' : 'openai';
}
```

### 3. Minimax API Client
Implement a Minimax API client:

```typescript
// Add to the imports
// import Minimax from 'minimax-api-client'; // Hypothetical client

// Initialize Minimax if available
// const minimaxApiKey = Deno.env.get('MINIMAX_API_KEY');
// const minimax = minimaxApiKey ? new Minimax({ auth: minimaxApiKey }) : null;
```

### 4. Image Generation Logic
Add Minimax image generation logic in the banner generation section:

```typescript
// Use selected API for image generation
if (selectedAPI === 'openai') {
  // Existing OpenAI logic
} else if (selectedAPI === 'replicate' && replicate) {
  // Existing Replicate logic
} else if (selectedAPI === 'minimax' && minimax) {
  // Minimax image generation logic
  const output = await minimax.run("minimax/image-generation-model", {
    input: {
      prompt: detailedPrompt,
      width: size.width,
      height: size.height,
      // Add other Minimax-specific parameters
    }
  });
  
  if (output && output.image_url) {
    // Download and convert to base64
    const imgResponse = await fetch(output.image_url);
    const imgArrayBuffer = await imgResponse.arrayBuffer();
    imageBase64 = btoa(String.fromCharCode(...new Uint8Array(imgArrayBuffer)));
    apiUsed = 'Minimax';
  }
}
```

### 5. Environment Variables
Add Minimax API key to environment variables:
- `MINIMAX_API_KEY` - Minimax API key

## Benefits of Minimax Integration
1. **Cost-effective high-quality images**: Minimax offers high-quality image generation at a lower cost than OpenAI
2. **Geographic diversity**: Provides an alternative to Western AI services
3. **Additional redundancy**: Adds another option for image generation if other services are unavailable

## Considerations
1. **API availability**: Ensure Minimax API is available in the regions where the service will be used
2. **Quality comparison**: Test Minimax output quality against existing providers
3. **Pricing**: Verify current Minimax pricing and update costPerImage accordingly
4. **Rate limits**: Check Minimax rate limits and implement appropriate handling
5. **Content policies**: Review Minimax content policies to ensure compliance

## Next Steps
1. Create a Minimax account and obtain API credentials
2. Test Minimax API with sample prompts
3. Compare quality and performance with existing providers
4. Implement the integration if results are satisfactory
5. Update documentation with Minimax integration details