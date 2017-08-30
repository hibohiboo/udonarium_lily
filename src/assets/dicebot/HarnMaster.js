/* Generated by Opal 0.10.5 */
(function(Opal) {
  function $rb_gt(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
  }
  function $rb_le(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs <= rhs : lhs['$<='](rhs);
  }
  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $gvars = Opal.gvars;

  Opal.add_stubs(['$setPrefixes', '$==', '$getCheckResult', '$>', '$getFailResult', '$getSuccessResult', '$%', '$===', '$to_i', '$getCheckShockResult', '$getStrikeLocationHuman', '$roll', '$<=', '$getStrikeLocationHumanUpperTable', '$getStrikeLocationHumanDownTable', '$getStrikeLocationHumanNormalTable', '$raise', '$get_table_by_number', '$getLocationSide', '$getFaceLocation', '$debug', '$sub']);
  return (function($base, $super) {
    function $HarnMaster(){};
    var self = $HarnMaster = $klass($base, $super, 'HarnMaster', $HarnMaster);

    var def = self.$$proto, $scope = self.$$scope, TMP_1, TMP_2, TMP_3, TMP_4, TMP_5, TMP_6, TMP_7, TMP_8, TMP_9, TMP_10, TMP_11, TMP_12, TMP_13, TMP_14, TMP_15, TMP_16;

    self.$setPrefixes(["SHK\\d+.*", "SLH", "SLHU", "SLHD"]);

    Opal.defn(self, '$initialize', TMP_1 = function $$initialize() {
      var $a, $b, self = this, $iter = TMP_1.$$p, $yield = $iter || nil, $zuper = nil, $zuper_index = nil, $zuper_length = nil;

      TMP_1.$$p = null;
      $zuper = [];
      
      for($zuper_index = 0; $zuper_index < arguments.length; $zuper_index++) {
        $zuper[$zuper_index] = arguments[$zuper_index];
      }
      return ($a = ($b = self, Opal.find_super_dispatcher(self, 'initialize', TMP_1, false)), $a.$$p = $iter, $a).apply($b, $zuper);
    }, TMP_1.$$arity = 0);

    Opal.defn(self, '$gameName', TMP_2 = function $$gameName() {
      var self = this;

      return "ハーンマスター";
    }, TMP_2.$$arity = 0);

    Opal.defn(self, '$gameType', TMP_3 = function $$gameType() {
      var self = this;

      return "HarnMaster";
    }, TMP_3.$$arity = 0);

    Opal.defn(self, '$getHelpMessage', TMP_4 = function $$getHelpMessage() {
      var self = this;

      return "・判定\n　1D100<=XX の判定時に致命的失敗・決定的成功を判定\n・ショック判定（SHKx）\n　例）SHK13,3\n・人型用　中段命中部位表 (SLH)／上段命中部位 (SLHU)／上段命中部位 (SLHD)\n";
    }, TMP_4.$$arity = 0);

    Opal.defn(self, '$check_1D100', TMP_5 = function $$check_1D100(total_n, dice_n, signOfInequality, diff, dice_cnt, dice_max, n1, n_max) {
      var $a, self = this, result = nil;

      if ((($a = (signOfInequality['$==']("<="))) !== nil && $a != null && (!$a.$$is_boolean || $a == true))) {
        } else {
        return ""
      };
      result = self.$getCheckResult(total_n, diff);
      return "＞ " + (result);
    }, TMP_5.$$arity = 8);

    Opal.defn(self, '$getCheckResult', TMP_6 = function $$getCheckResult(total, diff) {
      var $a, self = this;

      if ((($a = $rb_gt(total, diff)) !== nil && $a != null && (!$a.$$is_boolean || $a == true))) {
        return self.$getFailResult(total)};
      return self.$getSuccessResult(total);
    }, TMP_6.$$arity = 2);

    Opal.defn(self, '$getFailResult', TMP_7 = function $$getFailResult(total) {
      var self = this;

      if ((total['$%'](5))['$=='](0)) {
        return "致命的失敗"};
      return "失敗";
    }, TMP_7.$$arity = 1);

    Opal.defn(self, '$getSuccessResult', TMP_8 = function $$getSuccessResult(total) {
      var self = this;

      if ((total['$%'](5))['$=='](0)) {
        return "決定的成功"};
      return "成功";
    }, TMP_8.$$arity = 1);

    Opal.defn(self, '$rollDiceCommand', TMP_9 = function $$rollDiceCommand(command) {
      var $a, self = this, result = nil, $case = nil, toughness = nil, damage = nil, type = nil;

      result = nil;
      $case = command;if (/^SHK(\d*),(\d+)/i['$===']($case)) {toughness = (($a = $gvars['~']) === nil ? nil : $a['$[]'](1)).$to_i();
      damage = (($a = $gvars['~']) === nil ? nil : $a['$[]'](2)).$to_i();
      result = self.$getCheckShockResult(damage, toughness);}else if (/SLH(U|D)?/i['$===']($case)) {type = (($a = $gvars['~']) === nil ? nil : $a['$[]'](1));
      result = self.$getStrikeLocationHuman(type);}else {result = nil};
      return result;
    }, TMP_9.$$arity = 1);

    Opal.defn(self, '$getCheckShockResult', TMP_10 = function $$getCheckShockResult(damage, toughness) {
      var $a, $b, self = this, dice = nil, diceText = nil, result = nil, text = nil;

      $b = self.$roll(damage, 6), $a = Opal.to_ary($b), dice = ($a[0] == null ? nil : $a[0]), diceText = ($a[1] == null ? nil : $a[1]), $b;
      result = ((function() {if ((($a = ($rb_le(dice, toughness))) !== nil && $a != null && (!$a.$$is_boolean || $a == true))) {
        return "成功"
        } else {
        return "失敗"
      }; return nil; })());
      text = "ショック判定(ダメージ:" + (damage) + ", 耐久力:" + (toughness) + ") ＞ (" + (dice) + "[" + (diceText) + "]) ＞ " + (result);
      return text;
    }, TMP_10.$$arity = 2);

    Opal.defn(self, '$getStrikeLocationHuman', TMP_11 = function $$getStrikeLocationHuman(type) {
      var $a, $b, self = this, typeName = nil, table = nil, $case = nil, number = nil, part = nil, result = nil;

      typeName = "";
      table = nil;
      $case = type;if ("U"['$===']($case)) {typeName = "命中部位(人型 上段)";
      table = self.$getStrikeLocationHumanUpperTable();}else if ("D"['$===']($case)) {typeName = "命中部位(人型 下段)";
      table = self.$getStrikeLocationHumanDownTable();}else if (nil['$===']($case)) {typeName = "命中部位(人型 中段)";
      table = self.$getStrikeLocationHumanNormalTable();}else {self.$raise("unknow atak type " + (type))};
      $b = self.$roll(1, 100), $a = Opal.to_ary($b), number = ($a[0] == null ? nil : $a[0]), $b;
      part = self.$get_table_by_number(number, table);
      part = self.$getLocationSide(part, number);
      part = self.$getFaceLocation(part);
      result = "" + (typeName) + " ＞ (" + (number) + ")" + (part);
      return result;
    }, TMP_11.$$arity = 1);

    Opal.defn(self, '$getLocationSide', TMP_12 = function $$getLocationSide(part, number) {
      var $a, self = this, side = nil;

      if ((($a = /^\*/['$==='](part)) !== nil && $a != null && (!$a.$$is_boolean || $a == true))) {
        } else {
        self.$debug("part has NO side", part);
        return part;
      };
      self.$debug("part has side", part);
      side = ((function() {if ((($a = ((number['$%'](2))['$=='](1))) !== nil && $a != null && (!$a.$$is_boolean || $a == true))) {
        return "左"
        } else {
        return "右"
      }; return nil; })());
      return part = part.$sub(/\*/, side);
    }, TMP_12.$$arity = 2);

    Opal.defn(self, '$getFaceLocation', TMP_13 = function $$getFaceLocation(part) {
      var $a, $b, self = this, table = nil, number = nil, faceLocation = nil, result = nil;

      self.$debug("getFaceLocation part", part);
      if ((($a = /\+$/['$==='](part)) !== nil && $a != null && (!$a.$$is_boolean || $a == true))) {
        } else {
        self.$debug("is NOT Face");
        return part;
      };
      self.$debug("is Face");
      table = [[15, "顎"], [30, "*目"], [64, "*頬"], [80, "鼻"], [90, "*耳"], [100, "口"]];
      $b = self.$roll(1, 100), $a = Opal.to_ary($b), number = ($a[0] == null ? nil : $a[0]), $b;
      faceLocation = self.$get_table_by_number(number, table);
      self.$debug("faceLocation", faceLocation);
      self.$debug("number", number);
      faceLocation = self.$getLocationSide(faceLocation, number);
      result = part.$sub(/\+$/, " ＞ (" + (number) + ")" + (faceLocation));
      return result;
    }, TMP_13.$$arity = 1);

    Opal.defn(self, '$getStrikeLocationHumanUpperTable', TMP_14 = function $$getStrikeLocationHumanUpperTable() {
      var self = this, table = nil;

      table = [[15, "頭部"], [30, "顔+"], [45, "首"], [57, "*肩"], [69, "*上腕"], [73, "*肘"], [81, "*前腕"], [85, "*手"], [95, "胸部"], [100, "腹部"]];
      return table;
    }, TMP_14.$$arity = 0);

    Opal.defn(self, '$getStrikeLocationHumanNormalTable', TMP_15 = function $$getStrikeLocationHumanNormalTable() {
      var self = this, table = nil;

      table = [[5, "頭部"], [10, "顔+"], [15, "首"], [27, "*肩"], [33, "*上腕"], [35, "*肘"], [39, "*前腕"], [43, "*手"], [60, "胸部"], [70, "腹部"], [74, "股間"], [80, "*臀部"], [88, "*腿"], [90, "*膝"], [96, "*脛"], [100, "*足"]];
      return table;
    }, TMP_15.$$arity = 0);

    return (Opal.defn(self, '$getStrikeLocationHumanDownTable', TMP_16 = function $$getStrikeLocationHumanDownTable() {
      var self = this, table = nil;

      table = [[6, "*前腕"], [12, "*手"], [19, "胸部"], [29, "腹部"], [35, "股間"], [49, "*臀部"], [70, "*腿"], [78, "*膝"], [92, "*脛"], [100, "*足"]];
      return table;
    }, TMP_16.$$arity = 0), nil) && 'getStrikeLocationHumanDownTable';
  })($scope.base, $scope.get('DiceBot'))
})(Opal);

/* Generated by Opal 0.10.5 */
(function(Opal) {
  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice;

  Opal.add_stubs(['$exit']);
  return $scope.get('Kernel').$exit()
})(Opal);
