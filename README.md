#  S/4 HANA Product Masterdata RAG application

This sample CAP application uses the CAP LLM Plugin to simplify the process of accessing HANA Vector/Embedding features, connectivity to AI Core and automate the entire RAG retrieval flow. It demonstrates a RAG scenario where users can ask any questions regarding products data from S/4HANA and the application displays the relevant products based on the user query and the description generated by the LLM.

## Pre-requisite:

-   Login to [SAP BTP Trial cockpit](https://account.hanatrial.ondemand.com/trial/#/home/trial).
-   Navigate to your subaccount and make sure all roles are assigned for your user as shown below:
![assignroles](images/assignroles.png)

## Clone Repo

-   Navigate to Instances and Subscriptions and Open Business Application Studio
    ![open_bas](images/open_bas.png)

-   If dev space is already created, you can start the dev space as shown below. If not proceed to next step. 
    ![start_space](images/start_space.png)

-   Create dev space by following below steps:
    ![create_space1](images/create_space1.png)
    ![create_space2](images/create_space2.png)
    (Make Sure to Choose Python Tools)

-   Once dev space running click on the dev space name to open it.
    ![open_bas_space](images/open_bas_space.png)

-   Click on Git Clone Repo 
    ![clone_git1](images/clone_git1.png)
    and Provide followin url:
    `https://github.com/AjitKP91/cpa-rag-usecase.git`    
    
    Click open when you see following pop-up.
    ![clone_git2](images/clone_git2.png)
    
-   Replace the content of  ".cdsrc.json" with deployment ids as shown below.
    ![cdsrc](images/update-cdsrc.png)

## Import Destination
-   Open 'gen-ai-hub' file and update the values from the service key of your AI Core Instance. Replace client id, client secret, token url and api url as shown below:
    ![test](images/replace-destination-w-key.png)
-   save 'gen-ai-hub' file to your local computer. (Right click on 'gen-ai-hub' file and click Download)
    ![dowload1](images/dowload1.png)
-   Go to BTP cockpit and trial subaccount. Then navigate to Destination under connectivity menu item. Click on import destination.
    ![import_dest1](images/import_dest1.png)
-   Select the 'gen-ai-hub' file saved in previous step
    ![import_dest2](images/import_dest2.png)
-   Save the destination
    ![import_dest3](images/import_dest3.png)


## Deploy on SAP BTP:
-   Go to BTP Cockpit, Trial subaccount and Overview page. Then copy API Endpoint from Cloud Foundry Environment Section
    ![deploy2](images/deploy2.png)
-   Go to BAS and Open terminal by right clicking on mta.yaml file and choose open integrated terminal
    ![deploy1](images/deploy1.png)
-   use following command to login into cf:
    `cf login -a CF-API-Endpoint`    
    
    replace CF-API-Endpoint with api end point copied in previous step
-   Click on the temporary authentication code url and it should open the url in next tab
    ![deploy3](images/deploy3.png)
-   If asked, click on 'sign in with default identity provider' and it will generate the auth code.
    ![deploy4](images/deploy4.png)
-   Copy the authentication code and put it back in terminal to login.
    ![deploy5](images/deploy5.png)
-   Once logged in successfully, make sure targeted space is set as shown below.
    ![deploy6](images/deploy6.png)
-   Install dependencies by using following command:
    `npm install`
-   Build the project by using following command:    
    `npm run build`     
    Once built successfully, you should see following message
    ![deploy7](images/deploy7.png)
-   Depploy the project by using following command:
    `npm run deploy`    
    Once deployed successfully, you should see following messages. Copy the approuter url as shown below. Keep a note of approuter url.
    ![deploy8](images/deploy8.png)

## How to use the application:
-   Download the csv file and save it to local computer which contains material data from SAP S/4HANA. (Right click on s4-product-data.csv and choose download)
    ![dowload2](images/dowload2.png)
-   Open the approuter applciation URL (Saved in previous step from deployment)
-   Upload the "s4-products.csv" file by chosing upload files
    ![upload_csv1](images/upload_csv1.png)
    select the filw
    ![upload_csv1](images/upload_csv2.png)
    once successfullly uploaded:
    ![upload_csv1](images/upload_csv3.png)
-   Create the embedding of csv file uploaded in previous step. Click on Manage Files and click on create embedding
    ![create_embedding](images/create_embedding.png)

    **Note: It might take 1 to 2 minutes!**
-   Once embeddings created successfully, following message will appear:
    ![success_embedding](images/success_embedding.png)

    Now you can use the chat input message. 

#### Sample Chat Inputs to Tryout!

1. Sample Chat 1: (Click on **+ New Chat** For a fresh window chat) and use following message inputs one by one:            
    ```
    nutritional food for cats
    ``` 
    ```
    What is the weight of MonPetit Crispy Kisses Variety Pack Comp item?
    ```
    ```
    dental care kit for cat?
    ```
    ![sample_chat1](images/sample_chat1.png)
 
2. Sample Chat 2: Click on **+ New Chat** For a fresh window chat and use following message inputs  one by one:    
    ```
    Items used for skin protection
    ```
    ```
    What are Vaseline HG 100g products?
    ```
    ```
    provide product ids of Vaseline Products?
    ```
    ```
    List down the product ids and description for moisturizing hand?
    ```
    ![sample_chat2](images/sample_chat2.png)


## Agents Hand-On. 
-   If you have completed this hands-on, you can proceed to try out agents from [here](./agents/README.md)