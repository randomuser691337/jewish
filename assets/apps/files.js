var imgExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'heic'];
var videoExtensions = ['mp4', 'avi', 'mov', 'mkv'];

function viewmed(val, name) {
  let mediaType;
  let fileExtension = name.split('.').pop().toLowerCase();

  if (imgExtensions.includes(fileExtension)) {
    mediaType = 'img';
  } else if (videoExtensions.includes(fileExtension)) {
    mediaType = 'video';
  } else {
    mkw(val, name, '400px');
    return;
  }

  const mediaTag = mediaType === 'img' ? 'img' : 'video';
  const mediaSrcAttribute = mediaType === 'img' ? 'src' : 'src';
  const randomId = gen(7);
  const mediaElement = `<${mediaTag} class="embed" ${mediaSrcAttribute}="${val}" id="${randomId}" controls></${mediaTag}>`;
  const containerId = gen(7);
  mkw(mediaElement, name, '300px', undefined, undefined, undefined, undefined);
  const containerElement = document.getElementById(containerId);
  containerElement.addEventListener('click', function () {
    const mediaElement = document.getElementById(randomId);
    if (mediaElement) {
      mediaElement.pause();
      dest(mediaElement);
    }
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
            const p = document.createElement('p');
            p.innerText = item.name;
            const cm2 = document.createElement('div');
            cm2.classList = "cm";
            cm2.id = gen(6);
            const b1 = document.createElement('button');
            b1.classList = "b1 b2";
            b1.textContent = "Open/View";
            b1.onclick = function () { viewmed(f, item.name, tard); };
            const b4 = document.createElement('button');
            b4.classList = "b1 b2";
            b4.textContent = "WebDrop";
            b4.onclick = function () { sends(item.name, f); };
            cm2.onclick = function () { dest(cm2.id); };
            const b2 = document.createElement('button');
            b2.classList = "b3";
            b2.textContent = "Close";
            const b5 = document.createElement('button');
            b5.classList = "b3";
            b5.textContent = "Copy";
            b5.onclick = function () { copied = f; copiedn = item.name; };
            const b7 = document.createElement('button');
            b7.classList = "b1 b2";
            b7.textContent = "Download";
            b7.onclick = function () { down(item.name, f); }
            const b8 = document.createElement('button');
            b8.classList = "b1 b2";
            b8.textContent = "Rename/Move";
            b8.onclick = function () {
              const main = document.createElement('div');
              const id = gen(6);
              const id2 = gen(6)
              main.id = id2;
              main.classList = "cm";
              const p = document.createElement('p');
              p.innerHTML = "Rename File: " + directoryPath + item.name;
              main.appendChild(p);
              const i = document.createElement('input');
              i.placeholder = "New name here...";
              i.classList = "i1";
              i.value = directoryPath + item.name;
              i.id = id;
              main.appendChild(i);
              const b = document.createElement('button');
              b.classList = "b1";
              b.innerHTML = "Rename!"
              const b2 = document.createElement('button');
              b2.classList = "b1";
              b2.innerHTML = "Cancel"
              b.onclick = function () { if (directoryPath + item.name === document.getElementById(id).value) { dest(id2); } else { renf(directoryPath + item.name, document.getElementById(id).value); delf(directoryPath + item.name); dfm(directoryPath); dest(id2); } }
              b2.onclick = function () { dest(id2); }
              main.appendChild(b2); main.appendChild(b);
              document.body.appendChild(main);
            };
            const b9 = document.createElement('button');
            b9.classList = "b1 b2";
            b9.textContent = "Set Wallpaper";
            b9.onclick = function () { writef(`/user/info/wall`, f); bgim(f); }
            const b6 = document.createElement('button');
            b6.classList = "b3";
            b6.textContent = "Paste";
            b6.onclick = function () { writef(`${directoryPath}${copiedn}`, copied); dfm(directoryPath); }
            const b3 = document.createElement('button');
            b3.classList = "b1 b2";
            b3.textContent = "Delete";
            b3.onclick = function () { delf(`${directoryPath}${item.name}`); dfm(directoryPath); };
            cm2.onclick = function () { dest(cm2.id) };
            document.body.appendChild(cm2);
            cm2.appendChild(p); cm2.appendChild(b1); cm2.appendChild(b4); cm2.appendChild(b7); cm2.appendChild(b9); cm2.appendChild(b8); cm2.appendChild(b3); cm2.appendChild(b5); cm2.appendChild(b2); cm2.appendChild(b6);
          });
        }
        directoryContentsDiv.appendChild(element);
      });
    }
  }
}
var valuesToCheck = [".jpg", ".png", ".svg", ".jpeg", ".webp", ".mp3", ".mp4", ".webm", '.wav', '.mpeg', '.gif'];