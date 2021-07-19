class ListItem {
  constructor(itemType, item, subName, subItems) {
    (this.itemType = itemType),
      (this.item = item),
      (this.subName = subName),
      (this.subItems = subItems);
  }
}

export default ListItem;
