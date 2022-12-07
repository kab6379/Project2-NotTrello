//Helper method to handle error messages
const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('taskMessage').classList.remove('hidden');
};

//Method to send POSTs to the database, Update and Delete also run through here
const sendPost = async (url, data, handler) => {

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    document.getElementById('taskMessage').classList.add('hidden');

    
    if(result.error) {
        handleError(result.error);
    }

    if(result.redirect) {
        window.location = result.redirect;
    }

    if(handler) {
        handler(result);
    }
};

//Helper method to hide error messages
const hideError = () => {
    document.getElementById('taskMessage').classList.add('hidden');
};

module.exports = {
    handleError,
    sendPost,
    hideError,
};