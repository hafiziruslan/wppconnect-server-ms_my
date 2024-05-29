import { Router } from 'express';
import multer from 'multer';
import swaggerUi from 'swagger-ui-express';
import uploadConfig from '../config/upload';
import * as CatalogController from '../controller/catalogController';
import * as CommunityController from '../controller/communityController';
import * as DeviceController from '../controller/deviceController';
import { encryptSession } from '../controller/encryptController';
import * as GroupController from '../controller/groupController';
import * as LabelsController from '../controller/labelsController';
import * as MessageController from '../controller/messageController';
import * as MiscController from '../controller/miscController';
import * as NewsletterController from '../controller/newsletterController';
import * as OrderController from '../controller/orderController';
import * as SessionController from '../controller/sessionController';
import * as StatusController from '../controller/statusController';
import verifyToken from '../middleware/auth';
import * as HealthCheck from '../middleware/healthCheck';
import * as prometheusRegister from '../middleware/instrumentation';
import statusConnection from '../middleware/statusConnection';
import swaggerDocument from '../swagger.json';

const upload = multer(uploadConfig as any);
const routes: Router = Router();

//Auth
routes.post('/api/:session/:secretkey/generate-token', encryptSession);
routes.post('/api/:session/:secretkey/clear-session-data', MiscController.clearSessionData);
routes.post('/api/:secretkey/restore-sessions', upload.single('file'), MiscController.restoreAllSessions);
routes.get('/api/:secretkey/backup-sessions', MiscController.backupAllSessions);
routes.post('/api/:secretkey/start-all', SessionController.startAllSessions);
routes.get('/api/:secretkey/show-all-sessions', SessionController.showAllSessions);
routes.get('/api/:session/check-connection-session', verifyToken, SessionController.checkConnectionSession);
routes.get('/api/:session/status-session', verifyToken, SessionController.getSessionState);
routes.get('/api/:session/qrcode-session', verifyToken, SessionController.getQrCode);
routes.post('/api/:session/start-session', verifyToken, SessionController.startSession);
routes.post('/api/:session/close-session', verifyToken, SessionController.closeSession);
routes.post('/api/:session/logout-session', verifyToken, statusConnection, SessionController.logOutSession);

//Profile
routes.get('/api/:session/check-number-status/:phone', verifyToken, statusConnection, DeviceController.checkNumberStatus);
// routes.get('/api/:session/profile/:phone', verifyToken, statusConnection, DeviceController.getNumberProfile);
routes.post('/api/:session/change-username', verifyToken, statusConnection, DeviceController.setProfileName);
routes.post('/api/:session/profile-pic', upload.single('file'), verifyToken, statusConnection, DeviceController.setProfilePic);
routes.post('/api/:session/profile-status', verifyToken, statusConnection, DeviceController.setProfileStatus);
routes.post('/api/:session/edit-business-profile', verifyToken, statusConnection, SessionController.editBusinessProfile);

//Contacts
routes.get('/api/:session/all-contacts', verifyToken, statusConnection, DeviceController.getAllContacts);
routes.get('/api/:session/contact/:phone', verifyToken, statusConnection, DeviceController.getContact);
routes.get('/api/:session/profile-pic/:phone', verifyToken, statusConnection, DeviceController.getProfilePicFromServer);
routes.get('/api/:session/profile-status/:phone', verifyToken, statusConnection, DeviceController.getStatus);
routes.get('/api/:session/blocklist', verifyToken, statusConnection, DeviceController.getBlockList);
routes.post('/api/:session/block-contact', verifyToken, statusConnection, DeviceController.blockContact);
routes.post('/api/:session/unblock-contact', verifyToken, statusConnection, DeviceController.unblockContact);

//Chats
routes.get('/api/:session/list-chats', verifyToken, statusConnection, DeviceController.listChats);
routes.get('/api/:session/all-chats-archived', verifyToken, statusConnection, DeviceController.getAllChatsArchiveds);
// routes.get('/api/:session/all-chats-with-messages',verifyToken,statusConnection,DeviceController.getAllChatsWithMessages);
// routes.get('/api/:session/all-chats',verifyToken,statusConnection,DeviceController.getAllChats);
routes.get('/api/:session/all-broadcast-list', verifyToken, statusConnection, GroupController.getAllBroadcastList);
routes.get('/api/:session/all-new-messages', verifyToken, statusConnection, DeviceController.getAllNewMessages);
routes.get('/api/:session/all-unread-messages', verifyToken, statusConnection, DeviceController.getAllUnreadMessages);
routes.get('/api/:session/all-messages-in-chat/:phone', verifyToken, statusConnection, DeviceController.getAllMessagesInChat);
routes.get('/api/:session/chat-by-id/:phone', verifyToken, statusConnection, DeviceController.getChatById);
routes.get('/api/:session/chat-is-online/:phone', verifyToken, statusConnection, DeviceController.getChatIsOnline);
routes.get('/api/:session/last-seen/:phone', verifyToken, statusConnection, DeviceController.getLastSeen);
routes.get('/api/:session/list-mutes/:type', verifyToken, statusConnection, DeviceController.getListMutes);
// routes.get('/api/:session/load-messages-in-chat/:phone',verifyToken,statusConnection,DeviceController.loadAndGetAllMessagesInChat);
routes.get('/api/:session/message-by-id/:messageId', verifyToken, statusConnection, DeviceController.getMessageById);
routes.post('/api/:session/archive-chat', verifyToken, statusConnection, DeviceController.archiveChat);
routes.post('/api/:session/archive-all-chats', verifyToken, statusConnection, DeviceController.archiveAllChats);
// routes.post('/api/:session/chat-state', verifyToken, statusConnection, DeviceController.setChatState);
routes.post('/api/:session/clear-chat', verifyToken, statusConnection, DeviceController.clearChat);
routes.post('/api/:session/clear-all-chats', verifyToken, statusConnection, DeviceController.clearAllChats);
routes.post('/api/:session/delete-chat', verifyToken, statusConnection, DeviceController.deleteChat);
routes.post('/api/:session/delete-all-chats', verifyToken, statusConnection, DeviceController.deleteAllChats);
routes.post('/api/:session/mark-unseen', verifyToken, statusConnection, DeviceController.markUnseenMessage);
routes.post('/api/:session/send-seen', verifyToken, statusConnection, DeviceController.sendSeen);
routes.post('/api/:session/send-mute', verifyToken, statusConnection, DeviceController.sendMute);
routes.post('/api/:session/pin-chat', verifyToken, statusConnection, DeviceController.pinChat);
routes.post('/api/:session/typing', verifyToken, statusConnection, DeviceController.setTyping);
routes.post('/api/:session/recording', verifyToken, statusConnection, DeviceController.setRecording);
routes.post('/api/:session/reject-call', verifyToken, statusConnection, DeviceController.rejectCall);

//Messages
routes.get('/api/:session/get-messages/:phone',verifyToken,statusConnection,DeviceController.getMessages);
routes.get('/api/:session/reactions/:id', verifyToken, statusConnection, DeviceController.getReactions);
// routes.get('/api/:session/unread-messages', verifyToken, statusConnection, DeviceController.getUnreadMessages);
routes.get('/api/:session/votes/:id', verifyToken, statusConnection, DeviceController.getVotes);
routes.post('/api/:session/contact-vcard', verifyToken, statusConnection, DeviceController.sendContactVcard);
routes.post('/api/:session/delete-message', verifyToken, statusConnection, DeviceController.deleteMessage);
routes.post('/api/:session/download-media', verifyToken, statusConnection, SessionController.downloadMediaByMessage);
routes.post('/api/:session/edit-message', verifyToken, statusConnection, MessageController.editMessage);
routes.post('/api/:session/forward-messages', verifyToken, statusConnection, DeviceController.forwardMessages);
routes.post('/api/:session/react-message', verifyToken, statusConnection, DeviceController.reactMessage);
routes.post('/api/:session/send-reply', verifyToken, statusConnection, MessageController.replyMessage);
// routes.post('/api/:session/send-status', verifyToken, statusConnection, MessageController.sendStatusText);
// routes.post('/api/:session/send-buttons', verifyToken, statusConnection, MessageController.sendButtons);
// routes.post('/api/:session/send-file-base64',verifyToken,statusConnection,MessageController.sendFile);
routes.post('/api/:session/send-file', upload.single('file'), verifyToken, statusConnection, MessageController.sendFile);
routes.post('/api/:session/send-message', verifyToken, statusConnection, MessageController.sendMessage);
routes.post('/api/:session/send-link-preview', verifyToken, statusConnection, MessageController.sendLinkPreview);
// routes.post('/api/:session/send-voice-base64',verifyToken,statusConnection,MessageController.sendVoice64);
routes.post('/api/:session/send-voice', verifyToken, statusConnection, MessageController.sendVoice);
routes.post('/api/:session/send-image', upload.single('file'), verifyToken, statusConnection, MessageController.sendFile);
routes.post('/api/:session/send-location', verifyToken, statusConnection, MessageController.sendLocation);
routes.post('/api/:session/send-mentioned', verifyToken, statusConnection, MessageController.sendMentioned);
routes.post('/api/:session/send-poll-message', verifyToken, statusConnection, MessageController.sendPollMessage);
routes.post('/api/:session/send-sticker-gif', upload.single('file'), verifyToken, statusConnection, MessageController.sendImageAsStickerGif);
routes.post('/api/:session/send-sticker', upload.single('file'), verifyToken, statusConnection, MessageController.sendImageAsSticker);
routes.post('/api/:session/send-list-message', verifyToken, statusConnection, MessageController.sendListMessage);
routes.post('/api/:session/send-link-catalog', verifyToken, statusConnection, CatalogController.sendLinkCatalog);
routes.post('/api/:session/send-order-message', verifyToken, statusConnection, MessageController.sendOrderMessage);
routes.post('/api/:session/star-message', verifyToken, statusConnection, DeviceController.starMessage);
routes.post('/api/:session/temporary-messages', verifyToken, statusConnection, DeviceController.setTemporaryMessages);

//Status
routes.post('/api/:session/send-text-storie', verifyToken, statusConnection, StatusController.sendTextStorie);
routes.post('/api/:session/send-image-storie', upload.single('file'), verifyToken, statusConnection, StatusController.sendImageStorie);
routes.post('/api/:session/send-video-storie', upload.single('file'), verifyToken, statusConnection, StatusController.sendVideoStorie);

//Groups
// routes.get('/api/:session/all-groups', verifyToken, statusConnection, GroupController.getAllGroups);
routes.get('/api/:session/common-groups/:wid', verifyToken, statusConnection, GroupController.getCommonGroups);
routes.get('/api/:session/group-admins/:groupId', verifyToken, statusConnection, GroupController.getGroupAdmins);
routes.get('/api/:session/group-invite-link/:groupId', verifyToken, statusConnection, GroupController.getGroupInviteLink);
routes.get('/api/:session/group-members-ids/:groupId', verifyToken, statusConnection, GroupController.getGroupMembersIds);
routes.get('/api/:session/group-members/:groupId', verifyToken, statusConnection, GroupController.getGroupMembers);
routes.get('/api/:session/group-revoke-link/:groupId', verifyToken, statusConnection, GroupController.revokeGroupInviteLink);
routes.post('/api/:session/create-group', verifyToken, statusConnection, GroupController.createGroup);
routes.post('/api/:session/group-subject', verifyToken, statusConnection, GroupController.setGroupSubject);
routes.post('/api/:session/group-description', verifyToken, statusConnection, GroupController.setGroupDescription);
routes.post('/api/:session/group-pic', upload.single('file'), verifyToken, statusConnection, GroupController.setGroupProfilePic);
routes.post('/api/:session/group-property', verifyToken, statusConnection, GroupController.setGroupProperty);
routes.post('/api/:session/messages-admins-only', verifyToken, statusConnection, GroupController.setMessagesAdminsOnly);
routes.post('/api/:session/promote-participant-group', verifyToken, statusConnection, GroupController.promoteParticipant);
routes.post('/api/:session/demote-participant-group', verifyToken, statusConnection, GroupController.demoteParticipant);
routes.post('/api/:session/add-participant-group', verifyToken, statusConnection, GroupController.addParticipant);
routes.post('/api/:session/remove-participant-group', verifyToken, statusConnection, GroupController.removeParticipant);
routes.post('/api/:session/group-info-from-invite-link', verifyToken, statusConnection, GroupController.getGroupInfoFromInviteLink);
routes.post('/api/:session/change-privacy-group', verifyToken, statusConnection, GroupController.changePrivacyGroup);
routes.post('/api/:session/join-code', verifyToken, statusConnection, GroupController.joinGroupByCode);
routes.post('/api/:session/leave-group', verifyToken, statusConnection, GroupController.leaveGroup);

//Community
routes.get('/api/:session/community-participants/:id', verifyToken, statusConnection, CommunityController.getCommunityParticipants);
routes.post('/api/:session/create-community', verifyToken, statusConnection, CommunityController.createCommunity);
routes.post('/api/:session/deactivate-community', verifyToken, statusConnection, CommunityController.deactivateCommunity);
routes.post('/api/:session/add-community-subgroup', verifyToken, statusConnection, CommunityController.addSubgroupsCommunity);
routes.post('/api/:session/remove-community-subgroup', verifyToken, statusConnection, CommunityController.removeSubgroupsCommunity);
routes.post('/api/:session/promote-community-participant', verifyToken, statusConnection, CommunityController.promoteCommunityParticipant);
routes.post('/api/:session/demote-community-participant', verifyToken, statusConnection, CommunityController.demoteCommunityParticipant);

//Newsletter
routes.post('/api/:session/newsletter', verifyToken, statusConnection, NewsletterController.createNewsletter);
routes.put('/api/:session/newsletter/:id', verifyToken, statusConnection, NewsletterController.editNewsletter);
routes.post('/api/:session/mute-newsletter/:id', verifyToken, statusConnection, NewsletterController.muteNewsletter);
routes.delete('/api/:session/newsletter/:id', verifyToken, statusConnection, NewsletterController.destroyNewsletter);

//Labels
routes.get('/api/:session/get-all-labels', verifyToken, statusConnection, LabelsController.getAllLabels);
routes.post('/api/:session/add-new-label', verifyToken, statusConnection, LabelsController.addNewLabel);
routes.post('/api/:session/add-or-remove-label', verifyToken, statusConnection, LabelsController.addOrRemoveLabels);
routes.put('/api/:session/delete-label/:id', verifyToken, statusConnection, LabelsController.deleteLabel);
routes.put('/api/:session/delete-all-labels', verifyToken, statusConnection, LabelsController.deleteAllLabels);

//Catalogs
routes.get('/api/:session/get-business-profiles-products', verifyToken, statusConnection, OrderController.getBusinessProfilesProducts);
routes.get('/api/:session/get-collections', verifyToken, statusConnection, CatalogController.getCollections);
routes.get('/api/:session/get-order-by-messageId/:messageId', verifyToken, statusConnection, OrderController.getOrderbyMsg);
routes.get('/api/:session/get-product-by-id', verifyToken, statusConnection, CatalogController.getProductById);
routes.get('/api/:session/get-products', verifyToken, statusConnection, CatalogController.getProducts);
routes.post('/api/:session/add-product-image', verifyToken, statusConnection, CatalogController.addProductImage);
routes.post('/api/:session/add-product', verifyToken, statusConnection, CatalogController.addProduct);
routes.post('/api/:session/change-product-image', verifyToken, statusConnection, CatalogController.changeProductImage);
routes.post('/api/:session/create-collection', verifyToken, statusConnection, CatalogController.createCollection);
routes.post('/api/:session/del-collection', verifyToken, statusConnection, CatalogController.deleteCollection);
routes.post('/api/:session/del-products', verifyToken, statusConnection, CatalogController.delProducts);
routes.post('/api/:session/edit-collection', verifyToken, statusConnection, CatalogController.editCollection);
routes.post('/api/:session/edit-product', verifyToken, statusConnection, CatalogController.editProduct);
routes.post('/api/:session/remove-product-image', verifyToken, statusConnection, CatalogController.removeProductImage);
routes.post('/api/:session/set-cart-enabled', verifyToken, statusConnection, CatalogController.updateCartEnabled);
routes.post('/api/:session/set-product-visibility', verifyToken, statusConnection, CatalogController.setProductVisibility);

//Misc
routes.get('/api/:session/get-battery-level', verifyToken, statusConnection, DeviceController.getBatteryLevel);
routes.get('/api/:session/get-media-by-message/:messageId', verifyToken, SessionController.getMediaByMessage);
routes.get('/api/:session/get-phone-number', verifyToken, statusConnection, DeviceController.getPhoneNumber);
routes.get('/api/:session/get-platform-from-message/:messageId', verifyToken, DeviceController.getPlatformFromMessage);
routes.get('/api/:session/host-device', verifyToken, statusConnection, DeviceController.getHostDevice);
routes.get('/api/:session/take-screenshot', verifyToken, MiscController.takeScreenshot);
routes.get('/healthz', HealthCheck.healthz);
routes.get('/metrics', prometheusRegister.metrics);
routes.get('/unhealthy', HealthCheck.unhealthy);
routes.post('/api/:session/chatwoot', DeviceController.chatWoot);
routes.post('/api/:session/set-limit', MiscController.setLimit);
routes.post('/api/:session/subscribe-presence', verifyToken, SessionController.subscribePresence);

//Swagger
routes.use('/api-docs', swaggerUi.serve);
routes.get('/api-docs', swaggerUi.setup(swaggerDocument));

export default routes;
