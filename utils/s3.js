const { S3 } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const multer = require("multer");

const s3 = new S3({
    region : "ap-south-1",
    credentials : {
        accessKeyId :process.env.S3_AC,
        secretAccessKey : process.env.S3_AC2    
    }    
});

// module.exports.upload = (bucketname, directoryprefix, filename) => multer({
//     storage : multerS3({
//         s3,
//         bucket : bucketname,
//         metadata : function(req, file, cb){
//             console.log(file); 
//             cb(null, {fieldname : file.fieldname});
//         },
//         key : function(req, file, cb) {
//             cb(null, directoryprefix + filename);
//         }
//     }),
// });

module.exports.upload = (bucketname, directoryprefix,name) => multer({
    storage : multerS3({
        s3,
        bucket : bucketname,
        metadata : function(req, file, cb){
            console.log(file); 
            cb(null, {fieldname : file.fieldname});
        },
        key : function(req, file, cb) {
            const ext = file.mimetype.split('/')[1]; 
            cb(null, directoryprefix + `${name}-${req.params.id}-${Date.now()}.${ext}`);
        }
    }),
});
// module.exports.uploadBlogs = (bucketname, directoryprefix) => multer({
//     storage : multerS3({
//         s3,
//         bucket : bucketname,
//         metadata : function(req, file, cb){
//             console.log(file); 
//             cb(null, {fieldname : file.fieldname});
//         },
//         key : function(req, file, cb) {
//             const ext = file.mimetype.split('/')[1]; 
//             cb(null, directoryprefix + `blogs-${req.params.id}-${Date.now()}.${ext}`);
//         }
//     }),
// });