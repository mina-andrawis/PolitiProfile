const useAddUser = async (uid, email) => {
    try {
      const response = await fetch('/api/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({uid, email}), // Send array in request body
      });
  
      const data = await response.json();
      console.log(data.message);
    } catch (e) {
      console.error('Error adding document:', e);
    }
  };

  export default useAddUser; 