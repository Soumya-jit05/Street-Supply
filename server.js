app.get('/api/dashboard', async (req, res) => {
  const supplierId = req.query.supplierId;

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const todayStart = new Date(today.setHours(0,0,0,0));
  const todayEnd = new Date(today.setHours(23,59,59,999));

  const yesterdayStart = new Date(yesterday.setHours(0,0,0,0));
  const yesterdayEnd = new Date(yesterday.setHours(23,59,59,999));

  const todayOrders = await Order.find({
    supplierId,
    orderDate: { $gte: todayStart, $lte: todayEnd }
  });

  const yesterdayOrders = await Order.find({
    supplierId,
    orderDate: { $gte: yesterdayStart, $lte: yesterdayEnd }
  });

  const todayEarnings = todayOrders.reduce((sum, o) => sum + o.price, 0);
  const yesterdayEarnings = yesterdayOrders.reduce((sum, o) => sum + o.price, 0);

  // Find top & least products
  const productStats = await Order.aggregate([
    { $match: { supplierId } },
    { $group: { _id: "$productName", totalQty: { $sum: "$quantity" } } },
    { $sort: { totalQty: -1 } }
  ]);

  res.json({
    todayEarnings,
    yesterdayEarnings,
    topProduct: productStats[0]?._id || '-',
    leastProduct: productStats[productStats.length - 1]?._id || '-'
  });
});