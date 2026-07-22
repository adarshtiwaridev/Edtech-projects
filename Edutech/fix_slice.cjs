const fs = require('fs');

const path = 'src/slices/courseSlice.js';
let content = fs.readFileSync(path, 'utf8');

const updateTarget = `export const updateCourse = createAsyncThunk(
  "course/updateCourse",
  async ({ courseId, payload }, { rejectWithValue }) => {
    try {
      return await updateCourseApi(courseId, payload);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);`;

const updateReplacement = `export const updateCourse = createAsyncThunk(
  "course/updateCourse",
  async ({ courseId, payload }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (payload.title) formData.append("courseName", payload.title);
      if (payload.description) formData.append("courseDescription", payload.description);
      if (payload.price !== undefined) formData.append("price", payload.price);
      if (payload.category) formData.append("category", payload.category);
      if (payload.level) formData.append("level", payload.level);
      if (payload.thumbnailFile) formData.append("thumbnailFile", payload.thumbnailFile);

      return await updateCourseApi(courseId, formData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);`;

if(content.includes(updateTarget)) {
  content = content.replace(updateTarget, updateReplacement);
} else if (content.includes(updateTarget.replace(/\r\n/g, '\n'))) {
  content = content.replace(updateTarget.replace(/\r\n/g, '\n'), updateReplacement);
} else {
  console.log("Could not find updateCourse target in courseSlice.js");
}

fs.writeFileSync(path, content, 'utf8');
console.log("Successfully replaced updateCourse in courseSlice.js");
