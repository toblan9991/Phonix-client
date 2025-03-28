// export const getLearningModules = async (token) => {
//   try {
//     console.log('Calling API with token:', token);
// // https://pho-nix.ca/Phonix-backend/api/ 
//     const response = await fetch('https://pho-nix.ca/Phonix-backend/api/learning/chapters', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     // const response = await fetch('https://42b0-209-87-29-242.ngrok-free.app/api/learning/chapters', {
//     //   headers: {
//     //     Authorization: `Bearer ${token}`,
//     //   },
//     // });
 
 
//     if (!response.ok) {
//       throw new Error(`HTTP status ${response.status}`);
//     }
 
 
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching learning modules:', error);
//     return null;
//   }
//  };
 
 
//  export const getModuleDetails = async (chapterId, token) => {
//   try {
//     const response = await fetch(`https://pho-nix.ca/Phonix-backend/api/learning/chapter/${chapterId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     // const response = await fetch(`https://42b0-209-87-29-242.ngrok-free.app/api/learning/chapter/${chapterId}`, {
//     //   headers: {
//     //     Authorization: `Bearer ${token}`,
//     //   },
//     // });
 
 
//     if (!response.ok) {
//       throw new Error(`HTTP status ${response.status}`);
//     }
 
 
//     return await response.json();
//   } catch (error) {
//     console.error(`Error fetching module details for chapter ${chapterId}:`, error);
//     return null;
//   }
//  };
 
 
//  export const getChaptersByModuleId = async (moduleId, token) => {
//   try {
//     const response = await fetch(`https://pho-nix.ca/Phonix-backend/api/learning/module/${moduleId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     // const response = await fetch(`https://42b0-209-87-29-242.ngrok-free.app/api/learning/module/${moduleId}`, {
//     //   headers: {
//     //     Authorization: `Bearer ${token}`,
//     //   },
//     // });
 
 
//     if (!response.ok) {
//       throw new Error(`HTTP status ${response.status}`);
//     }
 
 
//     return await response.json();
//   } catch (error) {
//     console.error(`Error fetching chapters for module ${moduleId}:`, error);
//     return null;
//   }
//  };
 
 
//  export const completeChapter = async (moduleId, chapterId, token) => {
//   try {
//     console.log('Token being used:', token);

//     const response = await fetch(`https://pho-nix.ca/Phonix-backend/api/learning/complete/${moduleId}/${chapterId}`, {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     // const response = await fetch(`https://42b0-209-87-29-242.ngrok-free.app/api/learning/complete/${moduleId}/${chapterId}`, {
//     //   method: 'POST',
//     //   headers: {
//     //     Authorization: `Bearer ${token}`,
//     //   },
//     // });
 
 
//     if (!response.ok) {
//       throw new Error(`HTTP status ${response.status}`);
//     }
 
 
//     return await response.json();
//   } catch (error) {
//     console.error(`Error completing chapter ${chapterId}:`, error);
//     return null;
//   }
//  };








export const getLearningModules = async (token) => {
  try {
    console.log('Calling API with token:', token);
// https://pho-nix.ca/Phonix-backend/api/ 
    // const response = await fetch('https://pho-nix.ca/Phonix-backend/api/learning/chapters', {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });

    const response = await fetch('https://efff-2001-569-7d09-e400-c06f-a0cc-dc78-58bb.ngrok-free.app/api/learning/chapters', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
 
 
    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }
 
 
    return await response.json();
  } catch (error) {
    console.error('Error fetching learning modules:', error);
    return null;
  }
 };
 
 
 export const getModuleDetails = async (chapterId, token) => {
  try {
    // const response = await fetch(`https://pho-nix.ca/Phonix-backend/api/learning/chapter/${chapterId}`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });

    const response = await fetch(`https://efff-2001-569-7d09-e400-c06f-a0cc-dc78-58bb.ngrok-free.app/api/learning/chapter/${chapterId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
 
 
    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }
 
 
    return await response.json();
  } catch (error) {
    console.error(`Error fetching module details for chapter ${chapterId}:`, error);
    return null;
  }
 };
 
 
 export const getChaptersByModuleId = async (moduleId, token) => {
  try {
    // const response = await fetch(`https://pho-nix.ca/Phonix-backend/api/learning/module/${moduleId}`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });

    const response = await fetch(`https://efff-2001-569-7d09-e400-c06f-a0cc-dc78-58bb.ngrok-free.app/api/learning/module/${moduleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
 
 
    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }
 
 
    return await response.json();
  } catch (error) {
    console.error(`Error fetching chapters for module ${moduleId}:`, error);
    return null;
  }
 };
 
 
 export const completeChapter = async (moduleId, chapterId, token) => {
  try {
    console.log('Token being used:', token);

    // const response = await fetch(`https://pho-nix.ca/Phonix-backend/api/learning/complete/${moduleId}/${chapterId}`, {
    //   method: 'POST',
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });

    const response = await fetch(`https://efff-2001-569-7d09-e400-c06f-a0cc-dc78-58bb.ngrok-free.app/api/learning/complete/${moduleId}/${chapterId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
 
 
    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }
 
 
    return await response.json();
  } catch (error) {
    console.error(`Error completing chapter ${chapterId}:`, error);
    return null;
  }
 };







 
 
 
 
 
 





 
 
 
 
 
 





 
 
 
 
 
 