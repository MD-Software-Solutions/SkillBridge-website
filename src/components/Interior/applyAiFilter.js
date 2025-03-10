export async function applyAiFilter(jobPosts, users) {
    try {
        console.log('Job Posts:', jobPosts);
        console.log('Users:', users);
        const response = await fetch('http://localhost:4000/generate-filter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify({ jobPosts, users }), 
        });
    
        if (!response.ok) {
          throw new Error('Failed to generate job recommendations');
        }
    
        const data = await response.json();
        return data.filteredJobs;

      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
}
