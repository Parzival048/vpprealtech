import { generateFaviconFiles, generateFaviconHtml, IconTransformationType } from '@realfavicongenerator/generate-favicon';
import { getNodeImageAdapter, loadAndConvertToSvg } from "@realfavicongenerator/image-adapter-node";
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

async function generateFavicons() {
    try {
        console.log('🎨 Generating favicons from VPP logo...');

        const imageAdapter = await getNodeImageAdapter();

        // Load the VPP logo (PNG will be auto-converted)
        const masterIcon = {
            icon: await loadAndConvertToSvg("src/assets/vpppng.png"),
        };

        const faviconSettings = {
            icon: {
                desktop: {
                    regularIconTransformation: {
                        type: IconTransformationType.None,
                    },
                    darkIconType: "none",
                },
                touch: {
                    transformation: {
                        type: IconTransformationType.None,
                    },
                    appTitle: "VPP Realtech"
                },
                webAppManifest: {
                    transformation: {
                        type: IconTransformationType.None,
                    },
                    backgroundColor: "#1A1A2E",
                    themeColor: "#FF6B35",
                    name: "VPP Realtech - Property Advisory",
                    shortName: "VPP Realtech",
                    display: "standalone"
                }
            },
            path: "/",
        };

        // Generate favicon files
        console.log('📦 Generating favicon files...');
        const files = await generateFaviconFiles(masterIcon, faviconSettings, imageAdapter);

        // Create public directory if it doesn't exist
        await mkdir('public', { recursive: true });

        // Save all favicon files
        for (const file of files) {
            const filePath = join('public', file.name);
            await writeFile(filePath, file.content);
            console.log(`✅ Created: ${file.name}`);
        }

        // Generate HTML markup
        console.log('\n📝 Generating HTML markup...');
        const html = await generateFaviconHtml(faviconSettings);

        // Save HTML markup to a file for reference
        await writeFile('public/favicon-html.txt', html.join('\n'));

        console.log('\n✨ Favicons generated successfully!');
        console.log('\n📋 Add the following to your index.html <head>:');
        console.log('-'.repeat(60));
        console.log(html.join('\n'));
        console.log('-'.repeat(60));

    } catch (error) {
        console.error('❌ Error generating favicons:', error);
        process.exit(1);
    }
}

generateFavicons();
