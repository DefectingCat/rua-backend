import mongoose from 'mongoose';

const info = {
  digital: {
    type: String,
  },
  hours: {
    type: Number,
  },
  minutes: {
    type: Number,
  },
  name: {
    type: String,
  },
  percent: {
    type: Number,
  },
  seconds: {
    type: Number,
  },
  text: {
    type: String,
  },
  total_seconds: {
    type: Number,
  },
  type: {
    type: String,
  },
};

const WakaSchema = new mongoose.Schema(
  {
    categories: [info],
    date: {
      type: Date,
    },
    dependencies: [],
    editors: [info],
    grand_total: [info],
    languages: [info],
    machines: [info],
    operating_systems: [info],
    projects: [
      {
        branches: [info],
        categories: [info],
        dependencies: [],
        editors: [info],
        entities: [info],
        grand_total: info,
        languages: [info],
        machines: [info],
        name: {
          type: String,
        },
        operating_systems: [info],
      },
    ],
  },
  {
    // 添加 Date 类型的 createAt 和 updateAt 字段
    timestamps: true,
  }
);

const Waka = mongoose.model('Waka', WakaSchema);

export default Waka;
