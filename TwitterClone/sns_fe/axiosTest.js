let axios = require('axios');

axios.put(url, imageFile, {
    headers: {
      'Content-Type': imageFile.type
    }
  });
