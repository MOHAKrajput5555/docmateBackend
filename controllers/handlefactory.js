const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const multer = require('multer');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
  
    if (!doc) {
      return next(new AppError(`No ${doc} found with that ID`, 404));
    }
  
    res.status(204).json({
      status: 'success',
      data: null
    });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if(!doc){
        return next(new AppError(`No ${doc} found with that ID`, 404));
    }
    res.status(201).json({
            status: 'success',
            data: {
                doc
            }
        });
});

exports.getAll = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.find();
        res.status(200).json({
            status: 'success',
            data: {
                doc,
            }
        });
    
});

exports.getOne = (Model)=> catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if(!doc){
        return next(new AppError(`No {doc} found with that ID`, 404));
    }
    res.status(200)
        .json({
            status: 'success',
            data: {
                doc
            }
        });
        next();
});

exports.createOne = Model => catchAsync(async (req,res,next)=>{
    const doc = await Model.create(req.body);
    res.status(201).json({
        status: 'success',
        data:{
            doc,
        }
    });
});

const multerStoragePhoto = multer.diskStorage({
    destination:(req, res, cb) => {
      cb(null, './../data/profile_images');
    },
    fileaname: (req, res, cb) => {
      const ext = filename.mimetype.split('/')[1];
      cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    }
  });

const multerStoragePan = multer.diskStorage({
    destination:(req, res, cb) => {
      cb(null, './../data/pan_Card');
    },
    fileaname: (req, res, cb) => {
      const ext = filename.mimetype.split('/')[1];
      cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    }
  });
  
  const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
      console.log(file.mimetype)
      cb(null, true);
    }else{
      cb(new AppError(`Not an image, Please upload image`, 400), false);
    }
  }
  
  const upload = multer({
    storage: multerStoragePhoto,
    fileFilter: multerFilter
  });

  const PanUpload = multer({
    storage: multerStoragePan
  })
  
  
  exports.uploadUserPhoto = upload.single('photo');
  exports.uploadPanCard = PanUpload.single('photo');


