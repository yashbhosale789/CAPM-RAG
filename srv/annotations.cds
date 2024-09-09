using { ChatService } from './chat-service';
using { EmbeddingStorageService } from './embedding-storage';


annotate ChatService with @(requires: 'authenticated-user') ;
annotate EmbeddingStorageService with @(requires: 'authenticated-user') ;

