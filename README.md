# CODE App Assessment

This assessment is designed to assess your skills. For this assessment you do not need to deploy anything. Everything can be developed and tested offline (only for NPM package you need a connection). You should also not need an actual connection with a Shopify store.

The boilerplate code that was provided is basicially what you get when you start a Firebase project. We removed the parts that are not needed for this test. The assignments are isolated parts and will not have to work in Firebase. We simply work with input and output files that needs to be processed. You'll need to setup integration tests to make the code testable.

Feel free to set it up how you like, but keep it logical.


## 1. Convert a Shopify order to an XML file

Use the `testdata/input/order-input.json` file to build a conversion towards an XML file. The file itself is not mandatory to create, but you need to test the output by writing some tests.
The result should be a function where the input JSON is provided as input and the output must be the XML like the sample below.

Below an example (structure) of how the output should look. In green some comments to help you.

```xml

<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<message xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="order_v2.2.xsd">
  <envelope>
		<webshop>
			<webshop_id>999</webshop_id>
			<webshop_name>CODE TEST</webshop_name>
		</webshop>
  </envelope>
  <content>
    <order>
      <order_id /><!-- Prefix with gid://shopify/FulfillmentOrder/. Like gid://shopify/FulfillmentOrder/xxxxx -->
      <customer_invoice><!-- billing address values -->
        <customer_id>0</customer_id>
        <customer_company_name/>
        <customer_firstname />
        <customer_lastname />
        <customer_address_street />
        <customer_address_street2/>
        <customer_address_zipcode />
        <customer_address_city />
        <customer_address_country />
        <customer_email />
        <customer_telephone />
        <customer_address_state/><!-- only applicable if filled -->
      </customer_invoice>
      <customer_shipping><!-- shipping address values -->
        <customer_company_name/>
        <customer_firstname />
        <customer_lastname />
        <customer_address_street />
        <customer_address_street2/>
        <customer_address_zipcode />
        <customer_address_city />
        <customer_address_country />
        <customer_email />
        <customer_telephone />
        <customer_address_state/><!-- only applicable if filled -->
      </customer_shipping>
      <order_date /><!-- format: ISO String (for instance: 2023-10-11T13:32:00.000Z) -->
      <payment><!-- Payment details -->
        <type />
        <price_total />
        <total_taxes />
        <price_shipping />
        <price_discount />
        <currency />
      </payment>
      <order_rows>
        <row>
          <row_nr>1</row_nr><!-- incremental number, starting with 1, 2, 3 etc -->
          <sku></sku>
          <name></name><!-- Title of product + variant -->
          <qty></qty><!-- quantity -->
          <base_price></base_price><!-- Price per piece -->
          <final_price></final_price><!-- Price for whole line -->
          <tax_percent></tax_percent><!-- Tax percentage in whole percents. So 21 for 21% -->
        </row>
      </order_rows>
    </order>
  </content>
</message>
```


### Requirements 

* You may write the file to a logical location, but that is not mandatory
* Build tests to test your integration

## 2. Convert a shipment XML to a Shopify Shipment

Use the `testdata/output/shipment.xml` file to build a conversion towards a shipment (fulfillment) in Shopify.

### Requirements

* Ensure you notify the customer
* Add the Tracking code and company to the fulfillment
* You do not have to check the line items. Please assume that the whole order needs to be fulfilled
* Build tests to test your integration

---

## References

* [Shopify API Documentation](https://shopify.dev/docs/api/admin)
* [Shopify API NPM Package - Official version](https://www.npmjs.com/package/@shopify/shopify-api)
* [Shopify API NPM Package - Unofficial version](https://www.npmjs.com/package/shopify-api-node)

## Generic Requirements

* Build the solution in Typescript
* Split the 2 assignments in 2 separate folders and take care of your file structure. 
    * If there are elements that you can share, please do that to avoid duplication
* Think about comments
* Write integration tests on your implementation (and make sure they work)
* Bonus points if you use the GraphQL API of Shopify instead of the REST API
* Bonus points if you build tests that cover some 'sad flows'
