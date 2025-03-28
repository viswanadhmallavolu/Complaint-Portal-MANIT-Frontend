//The FeedbackService will be forwarding the mail directly to the complaint portal mail id.
//This will take the details of the complaints and inform the user about his submission regarding the complaint
//This handles the task of the email transporting functionality


import  student_api  from '../api/student-api'; // Import the axios instance




export const SendFeedBack = async ({
    scholarNumber,
    name,
    stream,
    year,
    department,
    description,
    files
}: {
    scholarNumber: string;
    name: string;
    stream: string;
    year: string;
    department: string;
    description: string;
    files: File[];
}): Promise<boolean> => {
    try {
        const formData = new FormData();
        formData.append('scholarNumber', scholarNumber);
        formData.append('name', name);
        formData.append('stream', stream);
        formData.append('year', year);
        formData.append('department', department);
        formData.append('description', description);
        if (files && files.length > 0) {
            files.forEach((file) => {
            formData.append('files', file);
            });
        }

        const response = await student_api.post('/feedback', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.status === 200;
    } catch (error) {
        console.error("Error sending feedback:", error);
        return false;
    }
};