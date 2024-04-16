// Object to store directory contents
const directoryContentsCache = {};

function dfm(dir) {
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

  // Check if contents for current directory are cached
  if (directoryContentsCache[directoryPath]) {
    // Use cached contents to populate contents div
    populateContents(directoryContentsCache[directoryPath]);
  } else {
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
        // Cache directory contents
        directoryContentsCache[directoryPath] = contents;

        // Populate contents div
        populateContents(contents);
      }
    };

    request.onerror = function (event) {
      directoryContentsDiv.innerHTML = '<div>Error listing directory contents</div>';
      console.error("Error listing directory contents");
    };
  }

  // Function to populate contents div
  function populateContents(contents) {
    directoryContentsDiv.innerHTML = '';
    if (contents.length === 1 && contents[0].isFolder && breadcrumbs.length > 1) {
      // If only one folder is present and not at root, automatically click on it
      const folderElement = document.createElement('div');
      folderElement.classList.add('file-folder');
      folderElement.textContent = 'Folder: ' + contents[0].name;
      folderElement.addEventListener('click', () => {
        const newPath = directoryPath + contents[0].name + '/';
        dfm(newPath);
      });
      directoryContentsDiv.appendChild(folderElement);
      // Simulate click on the folder element
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
        }
        directoryContentsDiv.appendChild(element);
      });
    }
  }
}
