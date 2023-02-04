describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST',  `${Cypress.env('BACKEND')}/testing/reset`)
    cy.request('POST',  `${Cypress.env('BACKEND')}/users`, {
      username: 'user', name:'User', password: 'password'
    })
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.get('#login-form')
    cy.get('#username')
    cy.get('#password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('user')
      cy.get('#password').type('password')
      cy.get('#login-button').click()

      cy.contains('User logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('user')
      cy.get('#password').type('password2')
      cy.get('#login-button').click()

      cy.contains('Wrong credentials')
      cy.get('html').should('not.contain', 'User logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login('user', 'password')
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('input[name="title"]').type('The Blog')
      cy.get('input[name="author"]').type('Author')
      cy.get('input[name="url"]').type('http')
      cy.get('button[type="submit"]').click()

      cy.contains('The Blog')
    })

    describe('And a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'The Blog',
          author: 'Author',
          url: 'http'
        })
      })

      it('User can like a blog', function() {
        cy.contains('The Blog').contains('show').click()
        cy.contains('like').click()

        cy.contains('likes 1')
      })

      it('User can delete his blog', function()  {
        cy.contains('The Blog').contains('show').click()
        cy.contains('remove').click()

        cy.get('html').should('not.contain', 'The Blog')
      })

      it('User doesn\'t see delete button if not the creator', function() {
        cy.request('POST',  `${Cypress.env('BACKEND')}/users`, {
          username: 'user2', name:'User2', password: 'password'
        })
        cy.login('user2', 'password')

        cy.contains('The Blog').contains('show').click()
        cy.contains('The Blog').parent().should('not.contain', 'remove')
      })
    })

    describe('And multiple blogs exist', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'The Blog',
          author: 'Author',
          url: 'http',
          likes: 7
        })
        cy.createBlog({
          title: 'The Popular Blog',
          author: 'Author',
          url: 'http',
          likes: 50
        })
        cy.createBlog({
          title: 'The Unpopular Blog',
          author: 'Author',
          url: 'http'
        })
      })

      it('The blogs are ordered according to likes', function() {
        cy.get('.blog').eq(0).should('contain', 'The Popular Blog')
        cy.get('.blog').eq(1).should('contain', 'The Blog')
        cy.get('.blog').eq(2).should('contain', 'The Unpopular Blog')
      })
    })
  })
})