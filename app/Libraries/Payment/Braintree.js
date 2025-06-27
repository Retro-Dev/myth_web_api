'use strict'
const Env = use('Env');
const braintree = use('braintree');

class Braintree
{
    constructor()
    {
        this.gateway = new braintree.BraintreeGateway({
                          environment: Env.get('BRAINTREE_ENV'),
                          merchantId: Env.get('BRAINTREE_MERCHANT_ID'),
                          publicKey: Env.get('BRAINTREE_PUBLIC_KEY'),
                          privateKey: Env.get('BRAINTREE_PRIVATE_KEY'),
                        });
    }

    clientToken(customer_id)
    {
        return new Promise( (resolve,reject) => {
          this.gateway.clientToken.generate({
              customerId: customer_id
            }, (err, result) => {
              if(result.success){
                let response = {
                  code: 200,
                  message: 'Client token has been generated successfully',
                  data: result.clientToken
                }
                resolve(response)
              } else {
                let response = {
                  code: 400,
                  message: 'error',
                  data: err
                }
                reject(response);
              }
            });
        })
    }

    createCustomer(data)
    {
        new Promise( (resolve,reject) => {
          this.gateway.customer.create(data, (err, result) => {
              if(result.success){
                let response = {
                  code: 200,
                  message: 'Customer has been created successfully',
                  data: result
                }
                resolve(response);
              } else {
                let response = {
                  code: 400,
                  message: 'error',
                  data: err
                }
                reject(response);
              }
          });
        })
    }

    createCustomerCard(customer_id,card_token)
    {
        return new Promise( (resolve,reject) => {
            this.gateway.paymentMethod.create({
              customerId: customer_id,
              paymentMethodNonce: card_token
            }, (err, result) => {
                if(result.success){
                  let response = {
                    code: 200,
                    message: 'Card been created successfully',
                    data: result
                  }
                  resolve(response);
                } else {
                  let response = {
                    code: 400,
                    message: 'error',
                    data: err
                  }
                  reject(response);
                }
            });
        })
    }

    makeDefaultCard(customer_id,card_id)
    {
        return new Promise( (resolve,reject) => {
            this.gateway.paymentMethod.update(card_id, {
              options: {
                makeDefault: true
              }
            }).then(result => {
                let response = {
                    code: 200,
                    message: 'Card has been updated successfully',
                    data: result
                }
                resolve(response);
            }).catch( err => {
              let response = {
                  code: 400,
                  message: 'Card id is not valid',
                  data: err
              }
              reject(response);
            })
        })
    }

    async deleteCustomerCard(customer_id, card_id)
    {
        let response;
        try{
          response = await this.gateway.paymentMethod.delete(card_id)
        } catch (error){
            return {
              code: 400,
              message: 'error',
              data: error
            }
        }
        return {
          code: 200,
          message: 'Card has been deleted successfully',
          data: response
        }
    }

    customerCharge(customer_id, amount, capture=true, currency='usd', description='')
    {
        return new Promise( (resolve, reject) => {
            this.gateway.transaction.sale({
              amount: amount,
              customerId:customer_id,
              options: {
                submitForSettlement: true
              }
            }, (err, result) => {
              if (result.success) {
                resolve({
                  code: 200,
                  message: 'success',
                  data: result
                })
              } else {
                  reject({
                    code: 400,
                    message: err.message,
                    data: err
                  })
              }
            });
        })
    }
}
module.exports = Braintree;
