const cds = require('@sap/cds');
const { INSERT, DELETE, SELECT } = cds.ql;
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const { PDFLoader } = require('langchain/document_loaders/fs/pdf');


// Helper method to convert embeddings to buffer for insertion
let array2VectorBuffer = (data) => {
  const sizeFloat = 4;
  const sizeDimensions = 4;
  const bufferSize = data.length * sizeFloat + sizeDimensions;

  const buffer = Buffer.allocUnsafe(bufferSize);
  // write size into buffer
  buffer.writeUInt32LE(data.length, 0);
  data.forEach((value, index) => {
    buffer.writeFloatLE(value, index * sizeFloat + sizeDimensions);
  });
  return buffer;
};

// Helper method to delete file if it already exists
const deleteIfExists = (filePath) => {
  try {
    fs.unlink(filePath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log('File does not exist');
        } else {
          console.error('Error deleting file:', err);
        }
      } else {
        console.log('File deleted successfully');
      }
    });
  } catch (unlinkErr) {
    console.error('Error occurred while attempting to delete file:', unlinkErr);
  }
};


module.exports = function () {

  this.on('storeEmbeddings', async (req) => {
    try {

      const { uuid } = req.data;
      const db = await cds.connect.to('db');
      const { Files, DocumentChunk } = this.entities;
      const vectorplugin = await cds.connect.to("cap-llm-plugin");
      let textChunkEntries = [];

      // Check if document exists
      const isDocumentPresent = await SELECT.from(Files).where({ ID: uuid });
      if (isDocumentPresent.length == 0) {
        throw new Error(`Document with uuid:  ${uuid} not yet persisted in database!`)
      }

      // Load pdf from HANA and create a temp pdf doc
      const stream = await db.stream(SELECT('content').from(Files, uuid));
      const fileName = await SELECT('fileName').from(Files).where({ ID: uuid });
      const tempDocLocation = __dirname + `/${fileName[0].fileName}`;

      // Create a new PDF document
      // const pdfDoc = await PDFDocument.create();
      const pdfBytes = [];

      // Read PDF content and store it in pdfBytes array
      stream.on('data', (chunk) => {
        pdfBytes.push(chunk);
      });

      // Wait for the stream to finish
      await new Promise((resolve, reject) => {
        stream.on('end', () => {
          resolve();
        });
      });

      // Convert pdfBytes array to a single Buffer
      const pdfBuffer = Buffer.concat(pdfBytes);

      const csvDataInString = pdfBytes.toString('utf8');
      const csvProductData = csvDataInString.split('\r\n');
      const csvProductDataArray = csvProductData.map((data) => {
        return data.split(';');
      });

      // Delete existing embeddings 
      await DELETE.from(DocumentChunk);




      console.log("Generating the vector embeddings for the materials.");
      // For each text chunk generate the embeddings
      for (let index = 1; index < csvProductDataArray.length; index++) {
        if(csvProductDataArray[index].length != 2){continue;}
        console.log(index);
        const embedding = await vectorplugin.getEmbedding(csvProductDataArray[index][1]);
        const entry = {
          "text_chunk": csvProductDataArray[index][1],
          "metadata_column": csvProductDataArray[index][0],
          "embedding": array2VectorBuffer(embedding)
        };
        textChunkEntries.push(entry);
        if(textChunkEntries.length % 10 == 0 || index == csvProductDataArray.length - 1){
          console.log('Current Index while Inserting',index);
          let insertStatus = await cds.tx (async ()=>{ await INSERT.into(DocumentChunk).entries(textChunkEntries) });
          textChunkEntries = [];
        }
      }

      console.log("Inserting text chunks with embeddings into db.");

      // Delete temp document
      // deleteIfExists(tempDocLocation);

    }
    catch (error) {
      // Handle any errors that occur during the execution
      console.log('Error while generating and storing vector embeddings:', error);
      throw error;
    }
    return "Embeddings stored successfully!";

  })


  this.on('deleteEmbeddings', async () => {
    try {
      // Delete any previous records in the table
      const { DocumentChunk } = this.entities;
      await DELETE.from(DocumentChunk);
      return "Success!"
    }
    catch (error) {
      // Handle any errors that occur during the execution
      console.log('Error while deleting the embeddings content in db:', error);
      throw error;
    }
  })


}