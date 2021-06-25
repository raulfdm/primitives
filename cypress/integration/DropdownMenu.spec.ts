describe('DropdownMenu', () => {
  describe('given submenu user', () => {
    beforeEach(() => {
      cy.visitStory('dropdownmenu--submenus');
      cy.findByText('Open').click();
    });

    describe('when using pointer', () => {
      it('should open submenu and not focus first item when moving pointer over trigger', () => {
        pointerOver('Bookmarks →');
        cy.findByText('Inbox').should('not.be.focused');
      });

      it('should not close when moving pointer to submenu and back to parent trigger', () => {
        pointerOver('Bookmarks →');
        pointerOver('Inbox');
        pointerOver('Bookmarks →');
        cy.findByText('Inbox').should('be.visible');
      });

      it(
        'should close submenu when moving pointer away but remain open when moving towards',
        {
          viewportWidth: 550,
        },
        () => {
          // Moving away
          pointerOver('Bookmarks →');
          cy.findByText('Inbox').should('be.visible');
          pointerExitRightToLeft('Bookmarks →');
          cy.findByText('Inbox').should('not.exist');

          // Moving towards
          pointerOver('Bookmarks →');
          cy.findByText('Inbox').should('be.visible');
          pointerExitLeftToRight('Bookmarks →');
          cy.findByText('Inbox').should('be.visible');

          // Test at collision edge
          // Moving away
          pointerOver('Modulz →');
          cy.findByText('Radix').should('be.visible');
          pointerExitLeftToRight('Modulz →');
          cy.findByText('Radix').should('not.exist');

          // Moving towards
          pointerOver('Modulz →');
          cy.findByText('Radix').should('be.visible');
          pointerExitRightToLeft('Modulz →');
          cy.findByText('Radix').should('be.visible');
        }
      );

      it('should close submenu when moving pointer over any sibling item in parent menu', () => {
        // Item
        pointerOver('Bookmarks →');
        cy.findByText('Inbox').should('be.visible');
        pointerOver('New Tab');
        cy.findByText('Inbox').should('not.exist');

        // Disabled item
        pointerOver('Bookmarks →');
        cy.findByText('Inbox').should('be.visible');
        pointerOver('Print…');
        cy.findByText('Inbox').should('not.exist');

        // Trigger item
        pointerOver('Bookmarks →');
        cy.findByText('Inbox').should('be.visible');
        pointerOver('Tools →');
        cy.findByText('Inbox').should('not.exist');

        // Disabled trigger item
        pointerOver('Bookmarks →');
        cy.findByText('Inbox').should('be.visible');
        pointerOver('History →');
        cy.findByText('Inbox').should('not.exist');
      });

      it('should close submenu when moving pointer from open submenu to enabled or disabled trigger siblings', () => {
        // To submenu and then to sibling trigger in parent
        pointerOver('Bookmarks →');
        pointerOver('Inbox');
        pointerOver('Tools →');
        cy.findByText('Inbox').should('not.exist');

        // To submenu then to a disabled trigger sibling in parent
        pointerOver('Bookmarks →');
        pointerOver('Inbox');
        pointerOver('History →');
        cy.findByText('Inbox').should('not.exist');
      });

      it('should close unassociated submenus when moving pointer back to the root trigger', () => {
        // Open multiple nested submenus and back to trigger in root menu
        pointerOver('Bookmarks →');
        pointerOver('Modulz →');
        pointerOver('Radix');
        pointerOver('Bookmarks →');

        cy.findByText('Inbox').should('be.visible');
        cy.findByText('Radix').should('not.exist');
      });

      it('should close all menus when clicking item in any menu, or clicking outside', () => {
        // Root menu
        cy.findByText('New Tab').click();
        cy.findByText('New Tab').should('not.exist');

        // Submenu
        cy.findByText('Open').click();
        pointerOver('Bookmarks →');
        cy.findByText('Inbox').click();
        cy.findByText('New Tab').should('not.exist');
        cy.findByText('Inbox').should('not.exist');

        // Click outside
        cy.findByText('Open').click();
        cy.get('body').click({ force: true });
        cy.findByText('New Tab').should('not.exist');
      });
    });

    describe('When using keyboard', () => {
      it('should not open submenu when moving focus to trigger', () => {
        cy.findByText('Bookmarks →').focus();
        cy.findByText('Inbox').should('not.exist');
      });

      it('should open submenu and focus first item when pressing right arrow, enter or space key', () => {
        function shouldOpenOnKeydown(key: string) {
          cy.findByText('Bookmarks →').trigger('keydown', { key });
          cy.findByText('Inbox').should('be.focused').trigger('keydown', { key: 'ArrowLeft' });
        }

        shouldOpenOnKeydown(' ');
        shouldOpenOnKeydown('Enter');
        shouldOpenOnKeydown('ArrowRight');
      });

      it('should close only the focused submenu when pressing left arrow key', () => {
        cy.findByText('Bookmarks →').type('{enter}');
        cy.findByText('Modulz →').type('{enter}');
        cy.findByText('Stitches').type('{leftarrow}').should('not.exist');
        cy.findByText('Modulz →').should('be.visible');
        cy.findByText('New Window').should('be.visible');
      });

      it('should close all menus when pressing escape, enter or space key on any item', () => {
        // Test close on root menu
        cy.findByText('New Window').type('{esc}').should('not.exist');

        // Reopen menu and test keys from within the submenu
        cy.findByText('Open').click();
        cy.findByText('Bookmarks →').type('{enter}');
        cy.findByText('Inbox').type('{esc}').should('not.exist');
        cy.findByText('New Window').should('not.exist');
      });

      it('should scope typeahead behaviour to the active menu', () => {
        // Matching items outside of the active menu should not become focused
        pointerOver('Bookmarks →');
        pointerOver('Modulz →');
        cy.findByText('Stitches').focus().type('Inbox');
        cy.findByText('Inbox').should('not.have.focus');

        // Matching items inside of active menu should become focused
        pointerOver('Notion').focus().type('Inbox');
        cy.findByText('Inbox').should('have.focus');
      });
    });

    describe('When using pointer in RTL', () => {
      beforeEach(() => {
        cy.findByText('Right-to-left').click({ force: true });
        cy.findByText('Open').click();
      });

      it(
        'should close submenu when pointer moves away but remain open when moving towards',
        {
          viewportWidth: 550,
        },
        () => {
          // Moving away
          pointerOver('Bookmarks →');
          cy.findByText('Inbox').should('be.visible');
          pointerExitLeftToRight('Bookmarks →');
          cy.findByText('Inbox').should('not.exist');

          // Moving towards
          pointerOver('Bookmarks →');
          cy.findByText('Inbox').should('be.visible');
          pointerExitRightToLeft('Bookmarks →');
          cy.findByText('Inbox').should('be.visible');

          // Test at collision edge
          // Moving away
          pointerOver('Modulz →');
          cy.findByText('Radix').should('be.visible');
          pointerExitRightToLeft('Modulz →');
          cy.findByText('Radix').should('not.exist');

          // Moving towards
          pointerOver('Modulz →');
          cy.findByText('Radix').should('be.visible');
          pointerExitLeftToRight('Modulz →');
          cy.findByText('Radix').should('be.visible');
        }
      );
    });

    describe('When using keyboard in RTL', () => {
      beforeEach(() => {
        cy.findByText('Right-to-left').click({ force: true });
        cy.findByText('Open').click();
      });

      it('should open submenu and focus first item when pressing left arrow key but close when pressing right arrow key', () => {
        cy.findByText('Bookmarks →').trigger('keydown', { key: 'ArrowLeft' });
        cy.findByText('Inbox')
          .should('be.focused')
          .trigger('keydown', { key: 'ArrowRight' })
          .and('not.exist');

        // Root level menu should remain open
        cy.findByText('New Tab').should('be.visible');
      });
    });
  });

  /* ---------------------------------------------------------------------------------------------- */

  function pointerExitRightToLeft(elementText: string) {
    return cy
      .findByText(elementText)
      .focus()
      .realHover({ position: 'right' })
      .realHover({ position: 'bottomLeft' })
      .trigger('pointerout', 'bottomLeft', { pointerType: 'mouse' });
  }

  function pointerExitLeftToRight(elementText: string) {
    return cy
      .findByText(elementText)
      .focus()
      .realHover({ position: 'left' })
      .realHover({ position: 'bottomRight' })
      .trigger('pointerout', 'bottomRight', { pointerType: 'mouse' });
  }

  function pointerOver(elementText: string) {
    return cy.findByText(elementText).focus().realHover();
  }
});
