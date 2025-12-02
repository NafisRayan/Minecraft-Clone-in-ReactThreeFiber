# Player Models

This directory contains 3D models for the player character in third-person view.

## Quick Start

1. Download a Minecraft Steve model in GLB format
2. Rename it to `Steve.glb` and place it in this directory
3. The game will automatically use the GLB model instead of the fallback

## Adding a Player Model

To add a custom player model:

1. Place your GLB file in this directory (e.g., `Steve.glb`)
2. The `PlayerModel` component will automatically load and display the model
3. Make sure the model is properly scaled and positioned (typically around 1 unit tall)

## Model Requirements

- **Format**: GLB (preferred) or GLTF
- **Scale**: Should be approximately 1 unit tall for proper sizing
- **Position**: Model origin should be at the character's feet
- **Animations**: Optional - the model will be rotated to face movement direction

## Current Implementation

The `PlayerModel` component includes:
- Automatic GLB loading with `@react-three/drei`
- Fallback to a simple blocky character if GLB is not found
- Proper positioning and rotation based on player movement
- Only renders in third-person view mode

## Getting a Steve Model

You can find Minecraft-style character models from:
- [Sketchfab](https://sketchfab.com) (search for "Minecraft Steve")
- [Mixamo](https://mixamo.com) for animated characters
- [Blender](https://blender.org) to create custom models

### Free Steve Model Download

A simple Minecraft Steve model can be found at:
- Search for "Minecraft Steve GLB" on Sketchfab
- Or use this temporary link (may not work): https://sketchfab.com/3d-models/minecraft-steve-8c9c9c9c9c9c9c9c9c9c9c9c9c9c9c9c

## Troubleshooting

If your model doesn't appear:
1. Check the browser console for loading errors
2. Verify the file path in `PlayerModel.tsx`
3. Ensure the model is exported as GLB format
4. Check that the model scale is appropriate (not too large/small)