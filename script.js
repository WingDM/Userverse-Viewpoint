// Replace with the user's handle
const userHandle = "@fraeddic#fraeddic.neocities.org";
const userDomain = userHandle.split("#")[1];
const userName = userHandle.split("@")[1].split("#")[0];

const userUMLUrl = `https://${userDomain}/${userName}.uml`;
const userCMLUrl = `https://${userDomain}/userverse_first_post.cml`; // Assuming .cml for the post

// Fetch and Parse UML
fetch(userUMLUrl)
    .then(response => response.text())
    .then(uml => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(uml, "application/xml");
        document.getElementById('display_name').textContent = xmlDoc.querySelector('u').getAttribute('d');
        document.getElementById('bio').textContent = xmlDoc.querySelector('bio').textContent;
        document.getElementById('profile_image').src = xmlDoc.querySelector('i').getAttribute('src');

        const style = document.createElement('style');
        style.innerHTML = xmlDoc.querySelector('css').textContent;
        document.head.appendChild(style);

    });

// Fetch and Parse CML
fetch(userCMLUrl)
    .then(response => response.text())
    .then(cml => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(cml, "application/xml");
        document.getElementById('post_title').textContent = xmlDoc.querySelector('p').getAttribute('t');
        document.getElementById('post_description').textContent = xmlDoc.querySelector('des').textContent;
        const postContent = document.getElementById('post_content');
        const content = xmlDoc.querySelector('con');

        // Handle various content types
        for (const child of content.children) {
            if (child.tagName === 'txt') {
                postContent.innerHTML += `<p>${child.textContent}</p>`;
            } else if (child.tagName === 'i') {
                postContent.innerHTML += `<img src="${child.getAttribute('src')}" alt="Post Image">`;
            } else if (child.tagName === 'vid') {
                postContent.innerHTML += `<video src="${child.getAttribute('src')}" controls></video>`;
            } else if (child.tagName === 'lnk') {
                postContent.innerHTML += `<a href="${child.getAttribute('href')}" target="_blank">${child.getAttribute('href')}</a>`;
            }
        }
        document.getElementById('post_date').textContent = xmlDoc.querySelector('dat').textContent;

        const tags = xmlDoc.querySelectorAll('tag');
        const tagContainer = document.getElementById('post_tags');
        tags.forEach(tag => {
            tagContainer.innerHTML += `<span>#${tag.textContent} </span>`;
        });

        //Basic comment display.
        const comments = xmlDoc.querySelectorAll('com');
        const commentContainer = document.getElementById('post_comments');
        comments.forEach(comment => {
            commentContainer.innerHTML += `<p>Comment: ${comment.querySelector('txt').textContent}</p>`;
        });

        //Basic like display.
        const likes = xmlDoc.querySelectorAll('lik');
        const likeContainer = document.getElementById('post_likes');
        likeContainer.innerHTML += `<p>Likes: ${likes.length}</p>`;

        //basic share display.
        const shares = xmlDoc.querySelectorAll('shr');
        const shareContainer = document.getElementById('post_shares');
        shareContainer.innerHTML += `<p>Shares: ${shares.length}</p>`;
    });