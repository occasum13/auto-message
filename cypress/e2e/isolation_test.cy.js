it('should call the createExcel task successfully', () => {
    // Define test data (replace with your actual data)
    const data = {
      dataArray: [
        ['Data 1', 'Data 2', 'Data 3', '...'],
        // ... more rows
      ],
      filename: 'test_file.xlsx',
    };
  
    // Call the task with the test data
    cy.task('createExcel', data).then((response) => {
      expect(response).to.equal('Excel file created successfully');
    });
  });