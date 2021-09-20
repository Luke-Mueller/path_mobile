class ListItem {
  constructor(itemType, item, details, subName, subItems) {
    (this.itemType = itemType),
      (this.item = item),
      (this.details = details),
      (this.subName = subName),
      (this.subItems = subItems);
  }
}

export default ListItem;
