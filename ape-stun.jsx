/************************************************

ape-stun.jsx

DESCRIPTION

Part 1 of a Workflow to export text in Photoshop
to paths in Illustrator

*************************************************/

(function (global) {
  var app = global.app;
  var files = app.openDialog();

  // Returns the file path of a document

  function pathname (doc) {
    return Folder(doc.fullName.parent).fsName
  }

  // Iterates through each item in a list

  function each (list, iterator) {
    for (var index = 0; index < list.length; ++index) {
      iterator(list[index], index, list);
    }
  }

  // Exports all paths to Illustrator

  function exportPathsForIllustrator (doc) {
    var date = new Date().toLocaleString();
    var name = doc.name.replace(/(\.[a-z0-9]*)$/i, '');
    var path = pathname(doc);
    var options = new ExportOptionsIllustrator();
    var output;
    var file;
    var options;

    date = date.replace(/\//g, '-').replace(/\s/g, '.').replace(/[,]/g, '');
    options.path = IllustratorPathType.ALLPATHS;
    output = path + '/' + name + '.ai';
    file = new File(output);

    doc.exportDocument(file, ExportType.ILLUSTRATORPATHS, options);
  }

  // Renames all Work Paths with a unique name specified by date and #

  function nameDocumentWorkPath (doc, name) {
    var path = doc.pathItems.getByName('Work Path');

    if (!path) {
      return;
    }

    path.name = name;
  }

  // Go through each Text Layer and create a Work Path

  function processLayer (layer) {
    if (!(layer instanceof ArtLayer)) {
      return;
    }

    var textItem = layer.textItem;
    var doc = layer.parent.parent;
    var text = textItem.contents;
    var path;

    textItem.createPath();

    nameDocumentWorkPath(doc, text);
  }

  // Apply to all files selected for Workflow

  function processFile (file) {
    var doc = app.open(file);
    var textGroup = doc.layerSets.getByName('Text');
    var layers = textGroup.layers;

    each(layers, processLayer);

    exportPathsForIllustrator(doc);
  }

  each(files, processFile);

})(this);
