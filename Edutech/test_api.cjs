const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/courses/createCourse', {}, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log("STATUS:", res.status);
    console.log("DATA:", res.data);
  } catch (err) {
    if (err.response) {
      console.log("ERR STATUS:", err.response.status);
      console.log("ERR DATA:", err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

test();
