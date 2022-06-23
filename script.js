const API = `https://61c9d37520ac1c0017ed8eac.mockapi.io`;
const postCategory = document.querySelector(`#postCategory`);
const postContainer = document.querySelector(`#postContainer`);

const controller = (url, method=`GET`, obj) => {
    let options = {
        method: method,
        headers: {
            "Content-type": "application/json"
        }
    }

    if(obj) options.body = JSON.stringify(obj);

    return fetch(url, options).then(response => response.ok ? response.json() : Promise.reject(response.status));
}

const appendCategory = category => {
    let option = document.createElement(`option`);
    option.innerHTML = category.name;
    option.value = category.name;
	 console.log(option.value)

    postCategory.append(option);
}

const renderPostCategories = () => {
    controller(API+`/universes`)
        .then(categories => categories.forEach(cat => appendCategory(cat)))
        .catch(err => console.log(`In catch: ${err}`));
}

renderPostCategories();


const postForm = document.querySelector(`#postForm`);

postForm.addEventListener(`submit`, e => {
    e.preventDefault();

    let name = e.target.querySelector(`#postTitle`).value,
        
        category = e.target.querySelector(`#postCategory`).value,
        favourite = e.target.querySelector(`#postFavourite`).checked;

    let newPost = {
		name: name,
      category: category,
      favourite: favourite
    };

    controller(API+`/heroes`, `POST`, newPost)
        .then(data => renderPost(data))
        .catch(err => console.log(`In catch: ${err}`))
})

const renderPost = post => {
    let postBlock = document.createElement(`div`);
    postBlock.className = `col-12 col-sm-6 col-md-6`;

    let postCard = document.createElement(`div`);
    postCard.className = `card p-3`;
    postCard.innerHTML = `<h5 class="card-title">Name Surname: ${post.name}</h5>
    <h5 class="card-subtitle mb-2 text-muted">Comics: ${post.category}</h5>
    `;	

    let postFavourite = document.createElement(`div`);
    postFavourite.className = `mb-3 form-check`;
    postFavourite.innerHTML = `<label class="form-check-label" for="postFavourite${post.id}">Favourite</label>`;
	

    let postFavouriteInput = document.createElement(`input`);
    postFavouriteInput.className = `form-check-input`;
    postFavouriteInput.type = `checkbox`;
    postFavouriteInput.checked = post.favourite;
    postFavouriteInput.id = `postFavourite${post.id}`;

    postFavouriteInput.addEventListener(`change`, () => {
        controller(API+`/heroes/${post.id}`, `PUT`, {favourite: postFavouriteInput.checked});
    })

    postFavourite.append(postFavouriteInput);

    let postDelete = document.createElement(`button`);
    postDelete.className = `btn btn-danger`;
    postDelete.innerHTML = `Delete`;

    postDelete.addEventListener(`click`, () => {
        controller(API+`/heroes/${post.id}`, `DELETE`)
            .then(() => postBlock.remove())
            .catch(err => console.log(`In catch: ${err}`));
    })
    postCard.append(postFavourite, postDelete);
    postBlock.append(postCard);
    postContainer.append(postBlock);
}
const renderPosts = () => {
    controller(API+`/heroes`)
        .then(posts => posts.forEach(post => renderPost(post)))
        .catch(err => console.log(`In catch: ${err}`))
}
renderPosts();
