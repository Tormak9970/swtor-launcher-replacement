const fs = require('fs');
const path = require('path');
async function copyResources(destDir) {
    await copyResourcesRecursive(path.join(__dirname, 'resources'), destDir);
}
async function copyResourcesRecursive(originalDir, targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, {
      recursive: true
    });
  }
  const dirContents = fs.readdirSync(originalDir);
  for (const entr of dirContents) {
    const ogPath = path.join(originalDir, entr);
    const tPath = path.join(targetDir, entr);
    if (fs.statSync(ogPath).isFile()) {
      //is a file
      fs.copyFileSync(ogPath, tPath);
    } else {
      //is a dir
      await copyResourcesRecursive(ogPath, tPath);
    }
  }
}
module.exports = {
    "packagerConfig": {
        "productName": "SWTOR EMU",
        "icon": "public/EMU.ico",
        "extraResource": [
            "public/EMU.ico"
        ]
    },
    "hooks": {
        packageAfterExtract: async (forgeConfig, extractPath) => {
            await copyResources(path.join(extractPath, 'resources'));
        }
    },
    "makers": [
        {
            "name": "@electron-forge/maker-squirrel",
            "config": {
                "loadingGif": "public/assets/gif/LoadingAnimation.gif",
                "iconUrl": "https://cdn.jsdelivr.net/gh/Tormak9970/swtor-launcher-replacement@fe7d76b0913289d6298411c9ba9d2338a6397c78/app/public/EMU.ico",
                "setupIcon": "public/EMU.ico"
            }
        },
        {
            "name": "@electron-forge/maker-zip",
            "platforms": [
                "darwin"
            ]
        },
        {
            "name": "@electron-forge/maker-deb",
            "config": {}
        },
        {
            "name": "@electron-forge/maker-rpm",
            "config": {}
        }
    ]
}