export const generateHistory = async (
    Model,
    alias = '',
    db_connection,
    action = '',
    userId = '',
    productId = '',
    entity_type = '',
    entity_id = '',
    actionType = '',
    old_value = '',
    new_value = ''
) => {
    Model.afterCreate(async (model, options) => {
        const History = db_connection.models.History
        await History.create({
            user_id: model.user_id,
            entity_type: alias,
            entity_id: entity_id,
            action: actionType,
            new_value: model,
        })
    })

    //   //Apres mise à jour d'un produit
    //   Model.afterUpdate(async (product, options) => {
    //     const History = db_connection.models.History
    //     const previousData = product._previousDataValues
    //     await History.create({
    //       user_id: product.user_id,
    //       entity_type: 'produit',
    //       entity_id: product.product_id,
    //       action: 'modification',
    //       old_value: previousData,
    //       new_value: product,
    //     })
    //   })

    //   //Apres suppression d'un produit
    //   Model.afterDestroy(async (product, options) => {
    //     const History = db_connection.models.History
    //     await History.create({
    //       user_id: product.user_id,
    //       entity_type: 'produit',
    //       entity_id: product.product_id,
    //       action: 'suppression',
    //       old_value: product,
    //     })
    //   })

    //   //Apres restauration d'un produit
    //   Model.afterRestore(async (product, options) => {
    //     const History = db_connection.models.History
    //     await History.create({
    //       user_id: product.user_id,
    //       entity_type: 'produit',
    //       entity_id: product.product_id,
    //       action: 'restauration',
    //       new_value: product,
    //     })
    //   })

}