Cypress.Commands.add('createBlog', (title, author, url) => {
  // cy.contains('create blog').click()
  cy.get('#title').type(title);
  cy.get('#author').type(author);
  cy.get('#url').type(url);
  cy.get('#create-button').click();
})

Cypress.Commands.add('likeBlog', (blogIndex, numOfLikes) => {
  cy.get(`.blog:nth-child(${blogIndex})`).contains('View').click()

  for(let i = 0; i < numOfLikes; i++) {
    cy.get(`.blog:nth-child(${blogIndex})`).contains('like').click()
  }
})



describe('Bloglist app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Rama',
      username: 'ram',
      password: 'sita'
    }
    cy.request('POST', 'http://localhost:3001/api/users', user)
    cy.visit('http://localhost:5173')
  })
  it('login form is shown', function() {
    cy.contains('login').click
  })
  
  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('ram')
      cy.get('#password').type('sita')
      cy.get('#login-button').click()

      cy.contains('Rama logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('rama')
      cy.get('#password').type('sita')
      cy.get('#login-button').click()

      cy.get('.error').should('contain', 'wrong username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('.error').should('have.css', 'border-style', 'solid')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('#username').type('ram')
      cy.get('#password').type('sita')
      cy.get('#login-button').click()
    })

    it('A blog can be created0', function() {
      cy.contains('create blog').click()
      cy.get('#title').type('testing with cypress')
      cy.get('#author').type('ram')
      cy.get('#url').type('https://abc.com')
      cy.get('#create-button').click()

      cy.get('.notificationStyle').should('contain',`a new blog testing with cypress by ram added`)
      cy.contains('testing with cypress ram')
    })
  })

  describe('Login and toggle the blog for the details', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('#username').type('ram')
      cy.get('#password').type('sita')
      cy.get('#login-button').click()
    })

    it('create a blog and like the post', function() {
      cy.contains('create blog').click()
      cy.get('#title').type('testing with cypress')
      cy.get('#author').type('ram')
      cy.get('#url').type('https://abc.com')
      cy.get('#create-button').click()

      cy.get('.notificationStyle').should('contain',`a new blog testing with cypress by ram added`)
      cy.contains('testing with cypress ram')

      cy.contains('View').click()
      cy.contains('like').click()
      cy.contains('likes 1')
    })
  })

  describe('the user who created the blog can delete it', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('#username').type('ram')
      cy.get('#password').type('sita')
      cy.get('#login-button').click()
    })
    
    it('create and delete a blog', function() {
      cy.contains('create blog').click()
      cy.get('#title').type('testing with cypress')
      cy.get('#author').type('ram')
      cy.get('#url').type('https://abc.com')
      cy.get('#create-button').click()

      cy.get('.notificationStyle').should('contain',`a new blog testing with cypress by ram added`)
      cy.contains('testing with cypress ram')

      cy.contains('View').click()
      cy.contains('remove').click()
    })
  })

  describe('only the creator can see the delete button', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('#username').type('ram')
      cy.get('#password').type('sita')
      cy.get('#login-button').click()
    })

    it('creating a blog to check the delete button only visible to the user who created it', function() {
      cy.contains('create blog').click()
      cy.get('#title').type('testing with cypress')
      cy.get('#author').type('ram')
      cy.get('#url').type('https://abc.com')
      cy.get('#create-button').click()

      cy.get('.notificationStyle').should('contain',`a new blog testing with cypress by ram added`)
      cy.contains('testing with cypress ram')

      cy.contains('View').click()
      cy.contains('remove')
    })
  })

  describe('checks that the blogs are ordered according to max likes being first', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('#username').type('ram')
      cy.get('#password').type('sita')
      cy.get('#login-button').click()

      cy.contains('create blog').click()
    })

    it.only('creating some blogs', function() {
      
      // Create blogs with different like counts
    cy.createBlog('Blog with most likes', 'Author 1', 'https://blog1.com');
    cy.wait(5000);
    cy.createBlog('Blog with second most likes', 'Author 2', 'https://blog2.com');
    cy.wait(5000);
    cy.createBlog('Blog with less likes', 'Author 3', 'https://blog3.com');
    cy.wait(5000);

    // Like the blogs to update their like counts
    cy.likeBlog(1, 10);
    cy.wait(2000); // Wait for likes to update
    cy.likeBlog(2, 7);
    cy.wait(2000); // Wait for likes to update
    cy.likeBlog(3, 5);
    cy.wait(2000); // Wait for likes to update

    // Verify the order of blogs according to likes
    cy.get('.blog').eq(0).should('contain', 'Blog with most likes');
    cy.get('.blog').eq(1).should('contain', 'Blog with second most likes');
    cy.get('.blog').eq(2).should('contain', 'Blog with less likes');
    })
  })
})