# Image Setup Guide for Ceylon Cargo Transport Showcase Website

This guide will help you add the required images to your showcase website. All images should be sourced from [Unsplash](https://unsplash.com) under their free license.

## Required Images

### 1. Hero Section Background
**Location:** `apps/showcase/public/images/hero/warehouse-cargo.jpg`
**Search Terms:** "cargo warehouse", "shipping containers", "logistics warehouse"
**Recommended Images:**
- https://unsplash.com/photos/cargo-containers-in-warehouse
- Search: "cargo port warehouse containers"
**Specifications:**
- Minimum dimensions: 1920x1080px
- Aspect ratio: 16:9
- Should show: Large warehouse with cargo, containers, or shipping operations
- Will have dark overlay applied

**Unsplash Search URL:** https://unsplash.com/s/photos/cargo-warehouse

---

### 2. About Section Image
**Location:** `apps/showcase/public/images/about/warehouse-interior.jpg`
**Search Terms:** "warehouse interior", "logistics facility", "modern warehouse"
**Recommended Images:**
- Look for: Well-lit warehouse interior with orange/warm lighting
- Industrial warehouse with visible cargo operations
**Specifications:**
- Dimensions: 800x600px minimum
- Aspect ratio: 4:3 or 3:2
- Should show: Interior of a modern warehouse facility
- Good lighting, professional appearance

**Unsplash Search URL:** https://unsplash.com/s/photos/warehouse-interior

---

### 3. Container Images
**Location:** `apps/showcase/public/images/containers/`

You need 5 container images:

#### a) 20ft Standard Container
**Filename:** `20ft-standard.jpg`
**Search Terms:** "20 foot shipping container", "standard container blue"
**Specifications:**
- Show a blue or standard colored shipping container
- Ideally 20ft container (smaller size)
- Clear side view preferred

**Unsplash Search URL:** https://unsplash.com/s/photos/shipping-container

---

#### b) 40ft Standard Container
**Filename:** `40ft-standard.jpg`
**Search Terms:** "40 foot shipping container", "large shipping container"
**Specifications:**
- Show a larger 40ft shipping container
- Standard colors (blue, grey, or red)
- Side or three-quarter view

**Unsplash Search URL:** https://unsplash.com/s/photos/40-foot-shipping-container

---

#### c) 40ft High Cube Container
**Filename:** `40ft-high-cube.jpg`
**Search Terms:** "high cube container", "tall shipping container"
**Specifications:**
- Extra tall container (high cube variant)
- Can be any standard color
- Should look taller than regular containers

**Unsplash Search URL:** https://unsplash.com/s/photos/shipping-container-stack

---

#### d) 20ft Refrigerated Container
**Filename:** `20ft-refrigerated.jpg`
**Search Terms:** "refrigerated container", "reefer container", "cold storage container"
**Specifications:**
- White container with visible refrigeration unit
- Should show cooling equipment on one end
- 20ft size preferred

**Unsplash Search URL:** https://unsplash.com/s/photos/refrigerated-container

---

#### e) 40ft Refrigerated Container
**Filename:** `40ft-refrigerated.jpg`
**Search Terms:** "large refrigerated container", "40ft reefer container"
**Specifications:**
- Large white refrigerated container
- Visible cooling unit
- 40ft size

**Unsplash Search URL:** https://unsplash.com/s/photos/reefer-container

---

## Quick Download Instructions

### Method 1: Manual Download from Unsplash

1. Go to [Unsplash.com](https://unsplash.com)
2. Search for the recommended terms
3. Find a suitable high-quality image
4. Click "Download" (no attribution required for Unsplash License)
5. Rename the file according to the guide
6. Place in the correct directory

### Method 2: Using Unsplash API (Optional)

You can also use the Unsplash API to programmatically fetch images. However, manual selection often yields better results.

---

## Directory Structure

After adding all images, your structure should look like:

```
apps/showcase/public/images/
├── hero/
│   └── warehouse-cargo.jpg          (1920x1080+, warehouse/cargo background)
├── about/
│   └── warehouse-interior.jpg       (800x600+, warehouse interior)
├── containers/
│   ├── 20ft-standard.jpg           (standard blue/grey container)
│   ├── 40ft-standard.jpg           (large standard container)
│   ├── 40ft-high-cube.jpg          (tall container)
│   ├── 20ft-refrigerated.jpg       (white reefer container)
│   └── 40ft-refrigerated.jpg       (large white reefer)
└── logo/
    └── logo.png                     (already exists)
```

---

## Alternative Stock Photo Sources

If you can't find suitable images on Unsplash, try these alternatives:

1. **Pexels** - https://www.pexels.com
   - Also offers free stock photos
   - Good selection of logistics/industrial images

2. **Pixabay** - https://pixabay.com
   - Free images and videos
   - Commercial use allowed

3. **Freepik** - https://www.freepik.com
   - Free with attribution (or premium without)
   - Good industrial/logistics content

---

## Image Optimization Tips

After downloading, consider optimizing images for web:

1. **Resize images** to appropriate dimensions:
   - Hero: 1920x1080px
   - About: 1200x900px
   - Containers: 800x600px

2. **Compress images** using tools like:
   - TinyPNG (https://tinypng.com)
   - Squoosh (https://squoosh.app)
   - ImageOptim (Mac)

3. **Convert to WebP** format for better performance (optional):
   - Many online converters available
   - Next.js can handle automatic optimization

---

## Testing

After adding images, test by:

1. Running the development server:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:3000

3. Check:
   - Hero section has background image
   - About section shows warehouse interior
   - Container cards display container images

4. If images don't load:
   - Check file paths match exactly
   - Verify image files are in correct directories
   - Check browser console for errors
   - Clear browser cache and reload

---

## Fallback Behavior

The code includes fallback mechanisms:

- **Hero/About**: If image fails, shows colored background
- **Containers**: If image fails, shows Package icon

So the site will work even without images, but images greatly improve the visual appeal.

---

## Image Attribution (Optional)

While Unsplash doesn't require attribution, it's good practice to credit photographers:

Add to your footer or a credits page:
```
Photos from Unsplash.com by [Photographer Names]
```

---

## Need Help?

If you need assistance finding specific images:

1. Visit the Unsplash URLs provided
2. Filter by "Landscape" orientation for hero/about images
3. Filter by "Commercial use" (all Unsplash images are)
4. Download the highest quality available

---

## License Information

**Unsplash License:**
- ✅ Free to use
- ✅ Commercial and non-commercial purposes
- ✅ No permission needed
- ✅ No attribution required (but appreciated)

**Unsplash License URL:** https://unsplash.com/license

---

## Quick Links

- **Hero Images:** https://unsplash.com/s/photos/cargo-warehouse
- **Warehouse Interior:** https://unsplash.com/s/photos/warehouse-interior
- **Shipping Containers:** https://unsplash.com/s/photos/shipping-container
- **Refrigerated Containers:** https://unsplash.com/s/photos/refrigerated-container

---

Last Updated: January 2026
