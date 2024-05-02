function viewmed(val, name) {
  if (!(val.startsWith("data:image/")) &&
    !(val.startsWith("data:video/"))) {
    console.log('<!> Media type may be invalid.');
  }

  const mediaTag = mediaType === 'i' ? 'img' : 'video';
  const mediaSrcAttribute = mediaType === 'i' ? 'src' : 'src';
  const fuck = gen(7);
  const mediaElement = `<${mediaTag} class="embed" ${mediaSrcAttribute}="${val}" id="${fuck}" controls></${mediaTag}>`;
  const hi = gen(7);
  mkw(mediaElement, name, '300px', undefined, undefined, undefined, undefined);
  const hi2 = document.getElementById(hi);
  hi2.addEventListener('click', function () {
    const fucker = document.getElementById(fuck);
    fucker.pause();
    dest(fucker);
  });
}

async function dfm(dir) {
  const directoryContentsDiv = document.getElementById('directoryContents');
  const breadcrumbsDiv = document.getElementById('breadcrumbs');
  const directoryPath = dir;

  // Ensure dir parameter is provided and is a string
  if (typeof dir !== 'string' || dir.trim() === '') {
    console.error("Invalid directory path");
    return;
  }

  // Display breadcrumbs
  breadcrumbsDiv.innerHTML = '';
  const breadcrumbs = directoryPath.split('/').filter(Boolean);
  breadcrumbs.unshift('Root'); // Add root breadcrumb
  breadcrumbs.forEach((breadcrumb, index) => {
    const breadcrumbElement = document.createElement('span');
    breadcrumbElement.className = "crumb";
    breadcrumbElement.textContent = breadcrumb;
    if (index !== breadcrumbs.length - 1) {
      breadcrumbElement.addEventListener('click', () => {
        const newPath = '/' + breadcrumbs.slice(1, index + 1).join('/');
        dfm(newPath);
      });
    }
    breadcrumbsDiv.appendChild(breadcrumbElement);
    if (index !== breadcrumbs.length - 1) {
      breadcrumbsDiv.appendChild(document.createTextNode(' / '));
    }
  });

  // Open transaction to read files from database
  const transaction = db.transaction(['files'], 'readonly');
  const objectStore = transaction.objectStore('files');

  const contents = [];

  const request = objectStore.openCursor();

  request.onsuccess = function (event) {
    const cursor = event.target.result;
    if (cursor) {
      const filePath = cursor.value.path;

      if (filePath.startsWith(directoryPath) && filePath !== directoryPath) {
        const relativePath = filePath.substring(directoryPath.length);
        const parts = relativePath.split('/');
        const itemName = parts[0];
        const isFolder = parts.length > 1;

        if (!contents.find(item => item.name === itemName)) {
          contents.push({ name: itemName, isFolder });
        }
      }
      cursor.continue();
    } else {
      populateContents(contents);
    }
  };

  request.onerror = function (event) {
    directoryContentsDiv.innerHTML = '<div>Error listing directory contents</div>';
    console.error("Error listing directory contents");
  };
  // Function to populate contents div
  async function populateContents(contents) {
    directoryContentsDiv.innerHTML = '';
    if (contents.length === 1 && contents[0].isFolder && breadcrumbs.length > 1) {
      // If only one folder is present and not at root, automatically click on it because im fucking stupid and its a viable solution
      const folderElement = document.createElement('div');
      folderElement.classList.add('file-folder');
      folderElement.textContent = 'Folder: ' + contents[0].name;
      folderElement.addEventListener('click', () => {
        const newPath = directoryPath + contents[0].name + '/';
        dfm(newPath);
      });
      directoryContentsDiv.appendChild(folderElement);
      folderElement.click();
    } else {
      contents.forEach(item => {
        const element = document.createElement('div');
        element.classList.add('file-folder');
        if (item.isFolder) {
          element.textContent = 'Folder: ' + item.name;
          element.addEventListener('click', () => {
            const newPath = directoryPath + item.name + '/';
            dfm(newPath);
          });
        } else {
          element.textContent = 'File: ' + item.name;
          element.addEventListener('click', async () => {
            const f = await readf(`${directoryPath}${item.name}`);
            const tard = "i";
            cm(`<p>${item.name}</p><button class="b1 b2" onclick="viewmed('${f}', '${item.name}', '${tard}');">Open</button><button class="b1 b2" onclick="sends('${item.name}', '${f}');">Send</button><button class="b1 b2" onclick="delf('${directoryPath}${item.name}');dfm('${directoryPath}');">Delete</button><button class="b1 b2" onclick="copied = '${f}'; copiedn = '${item.name}';">Copy</button><button class="b1 b2" onclick="writef('${directoryPath}${copiedn}', '${copied}');dfm('${directoryPath}');">Paste</button><button class="b3">Close</button>`);
          });
        }
        directoryContentsDiv.appendChild(element);
      });
    }
  }
}
function isFileTooLarge(file) {
  // Convert file size to megabytes
  const fileSizeInMB = file.size / (1024 * 1024);
  return fileSizeInMB > 15;
}

var valuesToCheck = [".jpg", ".png", ".svg", ".jpeg", ".webp", ".mp3", ".mp4", ".webm", '.wav', '.mpeg', '.gif'];

// Function to handle file upload
async function handleFileUpload(file) {
  if (locked === false) {
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const content = reader.result;
        await writef(`/user/files/${file.name}`, content);
      };
      reader.readAsDataURL(file);
      snack('Uploaded file successfully! WebDesk might have frozen if the file was large, wait for it to unfreeze.', '3000');
    } catch (error) {
      snack(`Locker error: ${error}`, '3500');
      console.log(error);
    }
  } else {
    snack(`Unlock WebDesk to upload.`, '3500');
  }
}

// Event listener for file drag and drop
document.addEventListener('DOMContentLoaded', () => {
  const dropArea = document.body;

  dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
  });

  dropArea.addEventListener('dragleave', (event) => {
    event.preventDefault();
  });

  dropArea.addEventListener('drop', async (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
      await handleFileUpload(files[i]);
    }
  });
});

// Manual upload function
function upload() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '*/*';
  input.onchange = async (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      await handleFileUpload(files[i]);
    }
  };
  input.click();
}
