
context('Import Products', () => {
    it('add update - xlsx - ftp - new job', () => {
        //login
        cy.visit('http://import.com/admin')
        cy.get('#username')
            .type('admin').should('have.value', 'admin')
        cy.get('#login')
            .type('magento2').should('have.value', 'magento2')
        cy.get('.actions').find('button').as('loginButton')
        cy.get('@loginButton').click()

        //go to import page
        cy.get('.item-import-job').find('a').as('goToImportPageLink')
        cy.get('@goToImportPageLink').click({force:true})

        //go to new job page
        cy.get('#add').as('addJobButton')
        cy.get('@addJobButton').click()

        //specify general section
        cy.get('.general_is_active',{timeout: 60000}).find('.admin__actions-switch-label').as('generalIsActive')
        cy.get('@generalIsActive').click()
        cy.get('.general_title ').find('input')
            .type('Product Import - add update - xlsx - ftp')
            .should('have.value', 'Product Import - add update - xlsx - ftp')
        cy.get('.general_reindex').find('.admin__actions-switch-label').as('generalReindex')
        cy.get('@generalReindex').click()

        //specify Import Settings section
        cy.get('.fieldset_settings').find('.fieldset-wrapper-title').as('fieldsetSettings')
        cy.get('@fieldsetSettings').click()
        cy.get('.settings_entity').find('select').as('settingsEntity')
        cy.get('@settingsEntity').select('catalog_product');

        //specify Import Behavior section
        cy.get('.fieldset_behavior').find('.fieldset-wrapper-title').as('fieldsetBehaviour')
        cy.get('.behavior_behavior').find('select').as('behaviorBehavior')
        cy.get('@behaviorBehavior').select('append');

        //specify Import Source section
        cy.get('.type_file').find('select').as('importSourceType')
        cy.get('@importSourceType').select('xlsx');
        cy.get('.import_source').find('select').as('importSource')
        cy.get('@importSource').select('ftp');
        cy.get('.ftp_file_path').find('input').as('ftpFilePath')
        cy.get('@ftpFilePath')
            .type('/files/import_add_update.xlsx')
            .should('have.value', '/files/import_add_update.xlsx')
        cy.get('.ftp_host ').find('input').as('ftpHost')
        cy.get('@ftpHost')
            .type('***')
            .should('have.value', '***')
        cy.get('.ftp_port').find('input').as('ftpPort')
        cy.get('@ftpPort')
            .type('***')
            .should('have.value', '***')
        cy.get('.ftp_user').find('input').as('ftpUserName')
        cy.get('@ftpUserName')
            .type('***')
            .should('have.value', '***')
        cy.get('.ftp_password ').find('input').as('ftpPassword')
        cy.get('@ftpPassword')
            .type('***')
            .should('have.value', '***')

        //validate Import file
        cy.get('.source_check_button').click()
        cy.get('.fieldset_source').contains('File validated successfully',{timeout: 60000})

        //save and run process
        cy.get('#save_and_run').click({force:true})
        cy.get('.run').click()

        //check Import results
        cy.get('#debug-run').contains('Entity catalog_product',{timeout: 60000})
        cy.get('#debug-run').contains('The import was successful.',{timeout: 600000})
        cy.get('#debug-run').contains('REINDEX completed',{timeout: 600000})
        cy.get('#debug-run').contains('This file is empty').should('not.exist')
        cy.get('#debug-run').contains('Data validation failed').should('not.exist')
        cy.get('#debug-run').contains('Invalid').should('not.exist')
        cy.get('#debug-run').contains('Exception').should('not.exist')

        //check that products were created
        cy.get('#menu-magento-catalog-catalog').find('.item-catalog-products').find('a').as('goToProductsGrid')
        cy.get('@goToProductsGrid').click({force:true})
        cy.get('[data-bind="collapsible: {openClass: false, closeOnOuter: false}"]',{timeout: 60000}).find('button').as('filtersButton')
        cy.get('@filtersButton').click({force:true})
        cy.get('[name="sku"]').invoke('val', 'tst').trigger('change',{force:true})
        cy.get('[data-bind="i18n: \'Apply Filters\'"]',{timeout: 60000}).as('applyFiltersButton')
        cy.get('@applyFiltersButton').click({force:true})
        cy.get('.admin__data-grid-outer-wrap').contains('18 records found',{timeout: 60000})

        //check that configurable product has a child's products
        cy.get('.admin__data-grid-outer-wrap').contains('Test Configurable product',{timeout: 60000})
        cy.get('.admin__data-grid-outer-wrap').contains('Test Configurable product').click({force:true});
        cy.get('[data-index="configurable-matrix"]',{timeout: 60000}).find('tbody').find('tr').should('have.length', 9)

        //check that bundle product has a bundle selections
        cy.get('#back').as('backButton')
        cy.get('@backButton').click({force:true})
        cy.get('.data-row',{timeout: 60000})
        cy.get('.admin__data-grid-outer-wrap')
            .contains('Test Bundle product with dynamic price',{timeout: 60000});
        cy.get('.admin__data-grid-outer-wrap').contains('Test Bundle product with dynamic price').click({force:true});
        cy.get('[data-index="bundle_selections"]',{timeout: 60000}).find('tbody').find('tr').should('have.length', 2)

        //check that custom options were created
        cy.get('#back').as('backButton')
        cy.get('@backButton').click({force:true})
        cy.get('.data-row',{timeout: 60000})
        cy.get('.admin__data-grid-outer-wrap').contains('Test Bundle and Grouped - simple product 1',{timeout: 60000})
        cy.get('.admin__data-grid-outer-wrap')
            .contains('Test Bundle and Grouped - simple product 1').click({force:true});
        cy.get('[data-index="custom_options"]',{timeout: 60000}).find('.fieldset-wrapper-title').click({force:true});
        cy.get('[data-index="options"]').find('[data-index="values"]').find('tbody').find('tr').should('have.length', 3)
    })
})
