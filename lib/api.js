export const sendNotification = async (data) =>{
  console.log(data)
  fetch('/api/sendMail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }); // Re-throw the error for handling in the calling function
}