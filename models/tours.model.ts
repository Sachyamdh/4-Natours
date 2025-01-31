import mongoose, { Query } from "mongoose";
import { describe } from "node:test";
import slugify from "slugify";

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
    trim: true,
    maxlength: [40, "A tour name must have less or equal than 40 characters"],
    minlength: [10, "A tour name must have more or equal than 10 characters"],
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, "A tour must have a duration "],
  },
  max_group_size: {
    type: Number,
    required: [true, "A tour must have a group size"],
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have a difficulty"],
    enum: {
      values: ["easy", "medium", "difficult"],
      message: "Difficulty is either: easy, medium, difficult",
    },
  },
  ratings_average: {
    type: Number,
    default: 2.5,
    min: [1, "Rating must be above 1.0"],
    max: [5, "Rating must be below 5.0"],
  },
  ratings_quantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
  price_discount: {
    type: Number,
    validate: {
      validator: function (val: number) {
        return val < (this as any).price;
      },
      message: "Discount price ({VALUE}) should be below regular price",
    },
  },
  summary: {
    type: String,
    trim: true,
    required: [true, "A tour must have a summary"],
  },
  description: {
    type: String,
    trim: true,
  },
  image_cover: {
    type: String,
    required: [true, "A tour must have a cover image"],
  },
  created_date: {
    type: Date,
    default: Date.now(),
  },
  start_dates: [Date],
  secret_tour: {
    type: Boolean,
    default: false,
  },
  start_location: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    coordinates: [Number],
    address: String,
    description: String,
  },
  location: [
    {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number,
    },
  ],
  guides: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

// slufify middleware: adds a slugify text for the tour
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
});

// query to filter the secrete tours only f. This always pre qyuery
tourSchema.pre(/^find/, function (this: Query<any, any>, next) {
  this.find({ secret_tour: { $ne: true } });
  this.set("start", Date.now());
  next();
});

//post request middleware: Checks for the query time for optimizatioin(will be done in the future)
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.get("start")} milliseconds`);
  next();
});

//aggregating secret tours
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secret_tour: { $ne: true } } });
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
