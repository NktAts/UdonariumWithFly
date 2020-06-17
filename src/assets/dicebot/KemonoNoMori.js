/* Generated by Opal 1.0.3 */
Opal.modules["utils/table"] = function(Opal) {
  function $rb_minus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
  }
  var self = Opal.top, $nesting = [], nil = Opal.nil, $$$ = Opal.const_get_qualified, $$ = Opal.const_get_relative, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $truthy = Opal.truthy;

  Opal.add_stubs(['$freeze', '$match', '$raise', '$to_i', '$[]', '$roll', '$-']);
  return (function($base, $super, $parent_nesting) {
    var self = $klass($base, $super, 'Table');

    var $nesting = [self].concat($parent_nesting), $Table_initialize$1, $Table_roll$2;

    self.$$prototype.times = self.$$prototype.sides = self.$$prototype.name = self.$$prototype.items = nil;
    
    
    Opal.def(self, '$initialize', $Table_initialize$1 = function $$initialize(name, type, items) {
      var self = this, m = nil;

      
      self.name = name;
      self.items = items.$freeze();
      m = /(\d+)D(\d+)/i.$match(type);
      if ($truthy(m)) {
      } else {
        self.$raise($$($nesting, 'ArgumentError'), "" + "Unexpected table type: " + (type))
      };
      self.times = m['$[]'](1).$to_i();
      return (self.sides = m['$[]'](2).$to_i());
    }, $Table_initialize$1.$$arity = 3);
    return (Opal.def(self, '$roll', $Table_roll$2 = function $$roll(bcdice) {
      var $a, $b, self = this, value = nil, index = nil;

      
      $b = bcdice.$roll(self.times, self.sides), $a = Opal.to_ary($b), (value = ($a[0] == null ? nil : $a[0])), $b;
      index = $rb_minus(value, self.times);
      return "" + (self.name) + "(" + (value) + ") \uFF1E " + (self.items['$[]'](index));
    }, $Table_roll$2.$$arity = 1), nil) && 'roll';
  })($nesting[0], null, $nesting)
};

/* Generated by Opal 1.0.3 */
Opal.modules["utils/range_table"] = function(Opal) {
  function $rb_minus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
  }
  function $rb_times(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs * rhs : lhs['$*'](rhs);
  }
  function $rb_plus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
  }
  var self = Opal.top, $nesting = [], nil = Opal.nil, $$$ = Opal.const_get_qualified, $$ = Opal.const_get_relative, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $send = Opal.send, $truthy = Opal.truthy;

  Opal.add_stubs(['$new', '$alias_method', '$freeze', '$lambda', '$name', '$sum', '$content', '$attr_reader', '$match', '$raise', '$to_i', '$[]', '$store', '$find', '$include?', '$range', '$roll', '$map', '$split', '$to_proc', '$fetch', '$formatted=', '$-', '$private', '$coerce_to_int_range', '$sort_by', '$min', '$assert_min_sum_is_covered', '$assert_max_sum_is_covered', '$assert_no_gap_or_overlap_in_ranges', '$===', '$is_a?', '$begin', '$end', '$class', '$first', '$*', '$last', '$each_cons', '$max', '$+']);
  return (function($base, $super, $parent_nesting) {
    var self = $klass($base, $super, 'RangeTable');

    var $nesting = [self].concat($parent_nesting), $RangeTable$1, $RangeTable$2, $RangeTable_initialize$3, $RangeTable_fetch$4, $RangeTable_roll$6, $RangeTable_store$7, $RangeTable_coerce_to_int_range$11, $RangeTable_assert_min_sum_is_covered$12, $RangeTable_assert_max_sum_is_covered$13, $RangeTable_assert_no_gap_or_overlap_in_ranges$14;

    self.$$prototype.name = self.$$prototype.items = self.$$prototype.num_of_dice = self.$$prototype.num_of_sides = self.$$prototype.formatter = nil;
    
    Opal.const_set($nesting[0], 'RollResult', $send($$($nesting, 'Struct'), 'new', ["sum", "values", "content", "formatted"], ($RangeTable$1 = function(){var self = $RangeTable$1.$$s || this;

    return self.$alias_method("to_s", "formatted")}, $RangeTable$1.$$s = self, $RangeTable$1.$$arity = 0, $RangeTable$1)));
    Opal.const_set($nesting[0], 'Item', $$($nesting, 'Struct').$new("range", "content"));
    Opal.const_set($nesting[0], 'DICE_ROLL_METHOD_RE', /^(\d+)D(\d+)$/i.$freeze());
    Opal.const_set($nesting[0], 'DEFAULT_FORMATTER', $send(self, 'lambda', [], ($RangeTable$2 = function(table, result){var self = $RangeTable$2.$$s || this;

    
      
      if (table == null) {
        table = nil;
      };
      
      if (result == null) {
        result = nil;
      };
      return "" + (table.$name()) + "(" + (result.$sum()) + ") \uFF1E " + (result.$content());}, $RangeTable$2.$$s = self, $RangeTable$2.$$arity = 2, $RangeTable$2)));
    self.$attr_reader("name");
    self.$attr_reader("num_of_dice");
    self.$attr_reader("num_of_sides");
    
    Opal.def(self, '$initialize', $RangeTable_initialize$3 = function $$initialize(name, dice_roll_method, items) {
      var $iter = $RangeTable_initialize$3.$$p, formatter = $iter || nil, $a, self = this, m = nil;

      if ($iter) $RangeTable_initialize$3.$$p = null;
      
      
      if ($iter) $RangeTable_initialize$3.$$p = null;;
      self.name = name.$freeze();
      self.formatter = ($truthy($a = formatter) ? $a : $$($nesting, 'DEFAULT_FORMATTER'));
      m = $$($nesting, 'DICE_ROLL_METHOD_RE').$match(dice_roll_method);
      if ($truthy(m)) {
      } else {
        self.$raise($$($nesting, 'ArgumentError'), "" + (self.name) + ": invalid dice roll method: " + (dice_roll_method))
      };
      self.num_of_dice = m['$[]'](1).$to_i();
      self.num_of_sides = m['$[]'](2).$to_i();
      return self.$store(items);
    }, $RangeTable_initialize$3.$$arity = 3);
    
    Opal.def(self, '$fetch', $RangeTable_fetch$4 = function $$fetch(value) {
      var $$5, self = this, item = nil;

      
      item = $send(self.items, 'find', [], ($$5 = function(i){var self = $$5.$$s || this;

      
        
        if (i == null) {
          i = nil;
        };
        return i.$range()['$include?'](value);}, $$5.$$s = self, $$5.$$arity = 1, $$5));
      if ($truthy(item)) {
      } else {
        self.$raise($$($nesting, 'RangeError'), "" + (self.name) + ": value is out of range: " + (value))
      };
      return item;
    }, $RangeTable_fetch$4.$$arity = 1);
    
    Opal.def(self, '$roll', $RangeTable_roll$6 = function $$roll(bcdice) {
      var $a, $b, self = this, sum = nil, values_str = nil, values = nil, result = nil, $writer = nil;

      
      $b = bcdice.$roll(self.num_of_dice, self.num_of_sides), $a = Opal.to_ary($b), (sum = ($a[0] == null ? nil : $a[0])), (values_str = ($a[1] == null ? nil : $a[1])), $b;
      values = $send(values_str.$split(","), 'map', [], "to_i".$to_proc());
      result = $$($nesting, 'RollResult').$new(sum, values, self.$fetch(sum).$content());
      
      $writer = [self.formatter['$[]'](self, result)];
      $send(result, 'formatted=', Opal.to_a($writer));
      $writer[$rb_minus($writer["length"], 1)];;
      return result;
    }, $RangeTable_roll$6.$$arity = 1);
    self.$private();
    
    Opal.def(self, '$store', $RangeTable_store$7 = function $$store(items) {
      var $$8, $$9, $$10, self = this, items_with_range = nil, sorted_items = nil;

      
      items_with_range = $send(items, 'map', [], ($$8 = function(r, c){var self = $$8.$$s || this;

      
        
        if (r == null) {
          r = nil;
        };
        
        if (c == null) {
          c = nil;
        };
        return [self.$coerce_to_int_range(r), c];}, $$8.$$s = self, $$8.$$arity = 2, $$8));
      sorted_items = $send(items_with_range, 'sort_by', [], ($$9 = function(r, _){var self = $$9.$$s || this;

      
        
        if (r == null) {
          r = nil;
        };
        
        if (_ == null) {
          _ = nil;
        };
        return r.$min();}, $$9.$$s = self, $$9.$$arity = 2, $$9));
      self.$assert_min_sum_is_covered(sorted_items);
      self.$assert_max_sum_is_covered(sorted_items);
      self.$assert_no_gap_or_overlap_in_ranges(sorted_items);
      self.items = $send(sorted_items, 'map', [], ($$10 = function(range, content){var self = $$10.$$s || this;

      
        
        if (range == null) {
          range = nil;
        };
        
        if (content == null) {
          content = nil;
        };
        return $$($nesting, 'Item').$new(range, content.$freeze()).$freeze();}, $$10.$$s = self, $$10.$$arity = 2, $$10)).$freeze();
      return self;
    }, $RangeTable_store$7.$$arity = 1);
    
    Opal.def(self, '$coerce_to_int_range', $RangeTable_coerce_to_int_range$11 = function $$coerce_to_int_range(x) {
      var $a, self = this, $case = nil;

      
      $case = x;
      if ($$($nesting, 'Integer')['$===']($case)) {return $$($nesting, 'Range').$new(x, x)}
      else if ($$($nesting, 'Range')['$===']($case)) {if ($truthy(($truthy($a = x.$begin()['$is_a?']($$($nesting, 'Integer'))) ? x.$end()['$is_a?']($$($nesting, 'Integer')) : $a))) {
        return x}};
      return self.$raise($$($nesting, 'TypeError'), "" + (self.name) + ": " + (x) + " (" + (x.$class()) + ") must be an Integer or a Range with Integers ");
    }, $RangeTable_coerce_to_int_range$11.$$arity = 1);
    
    Opal.def(self, '$assert_min_sum_is_covered', $RangeTable_assert_min_sum_is_covered$12 = function $$assert_min_sum_is_covered(sorted_items) {
      var self = this, min_sum = nil, range = nil;

      
      min_sum = self.num_of_dice;
      range = sorted_items.$first()['$[]'](0);
      if ($truthy(range['$include?'](min_sum))) {
      } else {
        self.$raise($$($nesting, 'RangeError'), "" + (self.name) + ": min value (" + (min_sum) + ") is not covered: " + (range))
      };
      return self;
    }, $RangeTable_assert_min_sum_is_covered$12.$$arity = 1);
    
    Opal.def(self, '$assert_max_sum_is_covered', $RangeTable_assert_max_sum_is_covered$13 = function $$assert_max_sum_is_covered(sorted_items) {
      var self = this, max_sum = nil, range = nil;

      
      max_sum = $rb_times(self.num_of_dice, self.num_of_sides);
      range = sorted_items.$last()['$[]'](0);
      if ($truthy(range['$include?'](max_sum))) {
      } else {
        self.$raise($$($nesting, 'RangeError'), "" + (self.name) + ": max value (" + (max_sum) + ") is not covered: " + (range))
      };
      return self;
    }, $RangeTable_assert_max_sum_is_covered$13.$$arity = 1);
    return (Opal.def(self, '$assert_no_gap_or_overlap_in_ranges', $RangeTable_assert_no_gap_or_overlap_in_ranges$14 = function $$assert_no_gap_or_overlap_in_ranges(sorted_items) {
      var $$15, self = this;

      
      $send(sorted_items, 'each_cons', [2], ($$15 = function(i1, i2){var self = $$15.$$s || this, r1 = nil, r2 = nil, max1 = nil, next_of_max1 = nil;
        if (self.name == null) self.name = nil;

      
        
        if (i1 == null) {
          i1 = nil;
        };
        
        if (i2 == null) {
          i2 = nil;
        };
        r1 = i1['$[]'](0);
        r2 = i2['$[]'](0);
        max1 = r1.$max();
        next_of_max1 = $rb_plus(max1, 1);
        if ($truthy(r2['$include?'](max1))) {
          self.$raise($$($nesting, 'RangeError'), "" + (self.name) + ": Range overlap: " + (r1) + " and " + (r2))};
        if ($truthy(r2['$include?'](next_of_max1))) {
          return nil
        } else {
          return self.$raise($$($nesting, 'RangeError'), "" + (self.name) + ": Range gap: " + (r1) + " and " + (r2))
        };}, $$15.$$s = self, $$15.$$arity = 2, $$15));
      return self;
    }, $RangeTable_assert_no_gap_or_overlap_in_ranges$14.$$arity = 1), nil) && 'assert_no_gap_or_overlap_in_ranges';
  })($nesting[0], null, $nesting)
};

/* Generated by Opal 1.0.3 */
(function(Opal) {
  function $rb_plus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
  }
  function $rb_divide(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs / rhs : lhs['$/'](rhs);
  }
  function $rb_le(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs <= rhs : lhs['$<='](rhs);
  }
  var self = Opal.top, $nesting = [], nil = Opal.nil, $$$ = Opal.const_get_qualified, $$ = Opal.const_get_relative, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $truthy = Opal.truthy, $hash2 = Opal.hash2, $range = Opal.range;

  Opal.add_stubs(['$require', '$===', '$check_1D12', '$getTrapResult', '$getEscapeExperienceTableResult', '$roll_tables', '$debug', '$match', '$to_i', '$parren_killer', '$[]', '$+', '$floor', '$/', '$roll', '$==', '$<=', '$freeze', '$new', '$setPrefixes', '$keys']);
  
  self.$require("utils/table.rb");
  self.$require("utils/range_table");
  return (function($base, $super, $parent_nesting) {
    var self = $klass($base, $super, 'KemonoNoMori');

    var $nesting = [self].concat($parent_nesting), $KemonoNoMori_rollDiceCommand$1, $KemonoNoMori_check_1D12$2, $KemonoNoMori_getTrapResult$3, $KemonoNoMori_getEscapeExperienceTableResult$4;

    
    Opal.const_set($nesting[0], 'ID', "KemonoNoMori");
    Opal.const_set($nesting[0], 'NAME', "\u7378\u30CE\u68EE");
    Opal.const_set($nesting[0], 'SORT_KEY', "\u3051\u3082\u306E\u306E\u3082\u308A");
    Opal.const_set($nesting[0], 'HELP_MESSAGE', "" + "\u30FB\u884C\u70BA\u5224\u5B9A(\u6210\u529F\u5EA6\u81EA\u52D5\u7B97\u51FA): KAx[\u00B1y]\n" + "\u30FB\u7D99\u7D9A\u5224\u5B9A(\u6210\u529F\u5EA6+1\u56FA\u5B9A): KCx[\u00B1y]\n" + "   x=\u76EE\u6A19\u5024\n" + "   y=\u76EE\u6A19\u5024\u3078\u306E\u4FEE\u6B63(\u4EFB\u610F) x+y-z \u306E\u3088\u3046\u306B\u8907\u6570\u6307\u5B9A\u53EF\u80FD\n" + "     \u4F8B1\uFF09KA7+3 \u2192 \u76EE\u6A19\u50247\u306B\u30D7\u30E9\u30B93\u306E\u4FEE\u6B63\u3092\u52A0\u3048\u305F\u884C\u70BA\u5224\u5B9A\n" + "     \u4F8B2\uFF09KC6 \u2192 \u76EE\u6A19\u50246\u306E\u7D99\u7D9A\u5224\u5B9A\n" + "\u30FB\u7F60\u52D5\u4F5C\u5224\u5B9A: CTR\n" + "   \u7F60\u3054\u3068\u306B1D12\u3092\u632F\u308B\u300212\u304C\u51FA\u305F\u5834\u5408\u306F\u7F60\u304C\u52D5\u4F5C\u3057\u3001\u7372\u7269\u304C\u305D\u306E\u52B9\u679C\u3092\u53D7\u3051\u308B\n" + "\u30FB\u5404\u7A2E\u8868\n" + "  \u30FB\u5927\u5931\u6557\u8868: FT\n" + "  \u30FB\u80FD\u529B\u5024\u30E9\u30F3\u30C0\u30E0\u6C7A\u5B9A\u8868: RST\n" + "  \u30FB\u30E9\u30F3\u30C0\u30E0\u6240\u8981\u6642\u9593\u8868: RTT\n" + "  \u30FB\u30E9\u30F3\u30C0\u30E0\u6D88\u8017\u8868: RET\n" + "  \u30FB\u30E9\u30F3\u30C0\u30E0\u5929\u6C17\u8868: RWT\n" + "  \u30FB\u30E9\u30F3\u30C0\u30E0\u5929\u6C17\u6301\u7D9A\u8868: RWDT\n" + "  \u30FB\u30E9\u30F3\u30C0\u30E0\u906E\u853D\u7269\u8868\uFF08\u5C4B\u5916\uFF09: ROMT\n" + "  \u30FB\u30E9\u30F3\u30C0\u30E0\u906E\u853D\u7269\u8868\uFF08\u5C4B\u5185\uFF09: RIMT\n" + "  \u30FB\u9003\u8D70\u4F53\u9A13\u8868: EET\n" + "  \u30FB\u98DF\u6750\u63A1\u96C6\u8868: GFT\n" + "  \u30FB\u6C34\u63A1\u96C6\u8868: GWT\n" + "  \u30FB\u767D\u306E\u9B54\u77F3\u52B9\u679C\u8868: WST\n");
    
    Opal.def(self, '$rollDiceCommand', $KemonoNoMori_rollDiceCommand$1 = function $$rollDiceCommand(command) {
      var self = this, $case = nil;

      return (function() {$case = command;
      if (/KA\d[-+\d]*/['$===']($case)) {return self.$check_1D12(command, true)}
      else if (/KC\d[-+\d]*/['$===']($case)) {return self.$check_1D12(command, false)}
      else if ("CTR"['$===']($case)) {return self.$getTrapResult()}
      else if ("EET"['$===']($case)) {return self.$getEscapeExperienceTableResult(command)}
      else {return self.$roll_tables(command, $$($nesting, 'TABLES'))}})()
    }, $KemonoNoMori_rollDiceCommand$1.$$arity = 1);
    
    Opal.def(self, '$check_1D12', $KemonoNoMori_check_1D12$2 = function $$check_1D12(command, is_action_judge) {
      var $a, $b, self = this, m = nil, target_total = nil, success_degree = nil, dice_total = nil;

      
      self.$debug("\u7378\u30CE\u68EE\u306E1d12\u5224\u5B9A");
      m = /K[AC](\d[-+\d]*)/.$match(command);
      if ($truthy(m)) {
      } else {
        return ""
      };
      target_total = self.$parren_killer("" + "(" + (m['$[]'](1)) + ")").$to_i();
      self.$debug("target_total", target_total);
      success_degree = (function() {if ($truthy(is_action_judge)) {
        return $rb_plus($rb_divide(target_total, 10).$floor(), 1)
      } else {
        return 1
      }; return nil; })();
      $b = self.$roll(1, 12), $a = Opal.to_ary($b), (dice_total = ($a[0] == null ? nil : $a[0])), $b;
      self.$debug("dice_total, target_total, success_degree = ", dice_total, target_total, success_degree);
      if (dice_total['$=='](12)) {
        return "" + "(1D12<=" + (target_total) + ") \uFF1E " + (dice_total) + " \uFF1E \u5927\u5931\u6557"
      } else if (dice_total['$=='](11)) {
        return "" + "(1D12<=" + (target_total) + ") \uFF1E " + (dice_total) + " \uFF1E \u5927\u6210\u529F\uFF08\u6210\u529F\u5EA6+" + (success_degree) + ", \u6B21\u306E\u7D99\u7D9A\u5224\u5B9A\u306E\u76EE\u6A19\u5024\u309210\u306B\u5909\u66F4\uFF09"
      } else if ($truthy($rb_le(dice_total, target_total))) {
        return "" + "(1D12<=" + (target_total) + ") \uFF1E " + (dice_total) + " \uFF1E \u6210\u529F\uFF08\u6210\u529F\u5EA6+" + (success_degree) + "\uFF09"
      } else {
        return "" + "(1D12<=" + (target_total) + ") \uFF1E " + (dice_total) + " \uFF1E \u5931\u6557"
      };
    }, $KemonoNoMori_check_1D12$2.$$arity = 2);
    
    Opal.def(self, '$getTrapResult', $KemonoNoMori_getTrapResult$3 = function $$getTrapResult() {
      var $a, $b, self = this, trapCheckNumber = nil, chaseNumber = nil, chase = nil, $case = nil;

      
      $b = self.$roll(1, 12), $a = Opal.to_ary($b), (trapCheckNumber = ($a[0] == null ? nil : $a[0])), $b;
      if (trapCheckNumber['$=='](12)) {
        
        $b = self.$roll(1, 12), $a = Opal.to_ary($b), (chaseNumber = ($a[0] == null ? nil : $a[0])), $b;
        chase = nil;
        $case = chaseNumber;
        if ((1)['$===']($case) || (2)['$===']($case) || (3)['$===']($case) || (4)['$===']($case)) {chase = "\u5C0F\u578B\u52D5\u7269"}
        else if ((5)['$===']($case) || (6)['$===']($case) || (7)['$===']($case) || (8)['$===']($case)) {chase = "\u5927\u578B\u52D5\u7269"}
        else if ((9)['$===']($case) || (10)['$===']($case) || (11)['$===']($case) || (12)['$===']($case)) {chase = "\u4EBA\u9593\u306E\u653E\u6D6A\u8005"};
        return "" + "\u7F60\u52D5\u4F5C\u30C1\u30A7\u30C3\u30AF(1D12) \uFF1E " + (trapCheckNumber) + " \uFF1E \u7F60\u304C\u52D5\u4F5C\u3057\u3066\u3044\u305F\uFF01 \uFF1E \u7372\u7269\u8868(" + (chaseNumber) + ") \uFF1E " + (chase) + "\u304C\u7F60\u306B\u304B\u304B\u3063\u3066\u3044\u305F";};
      return "" + "\u7F60\u52D5\u4F5C\u30C1\u30A7\u30C3\u30AF(1D12) \uFF1E " + (trapCheckNumber) + " \uFF1E \u7F60\u306F\u52D5\u4F5C\u3057\u3066\u3044\u306A\u304B\u3063\u305F";
    }, $KemonoNoMori_getTrapResult$3.$$arity = 0);
    
    Opal.def(self, '$getEscapeExperienceTableResult', $KemonoNoMori_getEscapeExperienceTableResult$4 = function $$getEscapeExperienceTableResult(command) {
      var $a, $b, self = this, escapeExperience = nil, escapeDuration = nil;

      
      escapeExperience = self.$roll_tables(command, $$($nesting, 'TABLES'));
      $b = self.$roll(1, 12), $a = Opal.to_ary($b), (escapeDuration = ($a[0] == null ? nil : $a[0])), $b;
      return "" + (escapeExperience) + " (\u518D\u767B\u5834: " + (escapeDuration) + "\u6642\u9593\u5F8C)";
    }, $KemonoNoMori_getEscapeExperienceTableResult$4.$$arity = 1);
    Opal.const_set($nesting[0], 'TABLES', $hash2(["FT", "RST", "RTT", "RET", "RWT", "RWDT", "ROMT", "RIMT", "EET", "GFT", "GWT", "WST"], {"FT": $$($nesting, 'RangeTable').$new("\u5927\u5931\u6557\u8868", "1D12", [[$range(1, 3, false), "\u3010\u4F59\u88D5\u3011\u304C3\u70B9\u6E1B\u5C11\u3059\u308B\uFF08\u6700\u4F4E0\u307E\u3067\uFF09"], [$range(4, 5, false), "\u30E9\u30F3\u30C0\u30E0\u306A\u8377\u72691\u500B\u304C\u843D\u3061\u3066\u884C\u65B9\u4E0D\u660E\u306B\u306A\u308B\uFF08\u5927\u5931\u6557\u3057\u305F\u30A8\u30EA\u30A2\u306E\u30A2\u30A4\u30C6\u30E0\u8ABF\u67FB\u3067\u898B\u3064\u3051\u308B\u3053\u3068\u304C\u53EF\u80FD\uFF09"], [$range(6, 7, false), "\u30E9\u30F3\u30C0\u30E0\u306A\u8377\u72691\u500B\u304C\u7834\u58CA\u3055\u308C\u308B"], [$range(8, 9, false), "\u30E9\u30F3\u30C0\u30E0\u5929\u6C17\u8868\u3092\u4F7F\u7528\u3057\u3001\u7D50\u679C\u3092\u30BF\u30FC\u30F3\u306E\u7D42\u4E86\u307E\u3067\u9069\u7528\u3059\u308B"], [10, "\u30E9\u30F3\u30C0\u30E0\u306A\u6E96\u5099\u3057\u3066\u3044\u308B\u5C0F\u9053\u51771\u500B\u304C\u7834\u58CA\u3055\u308C\u308B"], [11, "\u7740\u60F3\u3057\u3066\u3044\u308B\u9632\u5177\u304C\u7834\u58CA\u3055\u308C\u308B"], [12, "\u6E96\u5099\u3057\u3066\u3044\u308B\u6B66\u5668\u304C\u7834\u58CA\u3055\u308C\u308B"]]), "RST": $$($nesting, 'RangeTable').$new("\u80FD\u529B\u5024\u30E9\u30F3\u30C0\u30E0\u6C7A\u5B9A\u8868", "1D12", [[$range(1, 2, false), "\u3010\u79FB\u52D5\u3011"], [$range(3, 4, false), "\u3010\u683C\u95D8\u3011"], [$range(5, 6, false), "\u3010\u5C04\u6483\u3011"], [$range(7, 8, false), "\u3010\u88FD\u4F5C\u3011"], [$range(9, 10, false), "\u3010\u5BDF\u77E5\u3011"], [$range(11, 12, false), "\u3010\u81EA\u5236\u3011"]]), "RTT": $$($nesting, 'RangeTable').$new("\u30E9\u30F3\u30C0\u30E0\u6240\u8981\u6642\u9593\u8868", "1D12", [[$range(1, 3, false), "2"], [$range(4, 6, false), "3"], [$range(7, 9, false), "4"], [$range(10, 12, false), "5"]]), "RET": $$($nesting, 'RangeTable').$new("\u30E9\u30F3\u30C0\u30E0\u6D88\u8017\u8868", "1D12", [[$range(1, 3, false), "0"], [$range(4, 6, false), "1"], [$range(7, 9, false), "2"], [$range(10, 12, false), "4"]]), "RWT": $$($nesting, 'RangeTable').$new("\u30E9\u30F3\u30C0\u30E0\u5929\u6C17\u8868", "1D12", [[$range(1, 2, false), "\u6FC3\u9727"], [$range(3, 4, false), "\u5927\u96E8"], [$range(5, 6, false), "\u96F7\u96E8"], [$range(7, 8, false), "\u5F37\u98A8"], [$range(9, 10, false), "\u9177\u6691"], [$range(11, 12, false), "\u6975\u5BD2"]]), "RWDT": $$($nesting, 'RangeTable').$new("\u30E9\u30F3\u30C0\u30E0\u5929\u6C17\u6301\u7D9A\u8868", "1D12", [[$range(1, 2, false), "1\u30BF\u30FC\u30F3"], [$range(3, 4, false), "3\u30BF\u30FC\u30F3"], [$range(5, 6, false), "6\u30BF\u30FC\u30F3"], [$range(7, 8, false), "24\u30BF\u30FC\u30F3"], [$range(9, 10, false), "72\u30BF\u30FC\u30F3"], [$range(11, 12, false), "156\u30BF\u30FC\u30F3"]]), "ROMT": $$($nesting, 'RangeTable').$new("\u30E9\u30F3\u30C0\u30E0\u906E\u853D\u7269\u8868(\u5C4B\u5916)", "1D12", [[$range(1, 2, false), "\u3010\u85EA\u3011\u8010\u4E45\u5EA63,\u8EFD\u6E1B\u50241,\u7279\u6B8A\u52B9\u679C:\u30B3\u30F3\u30BF\u30AF\u30C8\u5185\u306E\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC\u306B\u5BFE\u3059\u308B\u5C04\u6483\u653B\u6483\u5224\u5B9A\u306B-1\u306E\u4FEE\u6B63\u3092\u4ED8\u52A0"], [$range(3, 5, false), "\u3010\u6728\u3011\u8010\u4E45\u5EA65,\u8EFD\u6E1B\u50242,\u7279\u6B8A\u52B9\u679C:\u30B3\u30F3\u30BF\u30AF\u30C8\u5185\u306E\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC\u306B\u5BFE\u3059\u308B\u5C04\u6483\u653B\u6483\u5224\u5B9A\u306B-1\u306E\u4FEE\u6B63\u3092\u4ED8\u52A0"], [$range(6, 8, false), "\u3010\u5927\u6728\u3011\u8010\u4E45\u5EA67,\u8EFD\u6E1B\u50243,\u7279\u6B8A\u52B9\u679C:\u30B3\u30F3\u30BF\u30AF\u30C8\u5185\u306E\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC\u306B\u5BFE\u3059\u308B\u5C04\u6483\u653B\u6483\u5224\u5B9A\u306B-2\u306E\u4FEE\u6B63\u3092\u4ED8\u52A0"], [$range(9, 10, false), "\u3010\u5CA9\u3011\u8010\u4E45\u5EA66,\u8EFD\u6E1B\u50244,\u7279\u6B8A\u52B9\u679C:\u30B3\u30F3\u30BF\u30AF\u30C8\u5185\u306E\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC\u306B\u5BFE\u3059\u308B\u5C04\u6483\u653B\u6483\u5224\u5B9A\u306B-1\u306E\u4FEE\u6B63\u3092\u4ED8\u52A0/\u30B3\u30F3\u30BF\u30AF\u30C8\u5185\u3067\u884C\u308F\u308C\u308B\u683C\u95D8\u653B\u6483\u306E\u30C0\u30E1\u30FC\u30B8+1"], [$range(11, 12, false), "\u3010\u5CA9\u58C1\u3011\u8010\u4E45\u5EA68,\u8EFD\u6E1B\u50244,\u7279\u6B8A\u52B9\u679C:\u30B3\u30F3\u30BF\u30AF\u30C8\u5185\u306E\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC\u306B\u5BFE\u3059\u308B\u5C04\u6483\u653B\u6483\u5224\u5B9A\u306B-2\u306E\u4FEE\u6B63\u3092\u4ED8\u52A0/\u30B3\u30F3\u30BF\u30AF\u30C8\u5185\u3067\u884C\u308F\u308C\u308B\u683C\u95D8\u653B\u6483\u306E\u30C0\u30E1\u30FC\u30B8+2"]]), "RIMT": $$($nesting, 'RangeTable').$new("\u30E9\u30F3\u30C0\u30E0\u906E\u853D\u7269\u8868(\u5C4B\u5185)", "1D12", [[$range(1, 4, false), "\u3010\u6728\u6750\u306E\u58C1\u3011\u8010\u4E45\u5EA64,\u8EFD\u6E1B\u50242,\u7279\u6B8A\u52B9\u679C:\u30B3\u30F3\u30BF\u30AF\u30C8\u5185\u306E\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC\u306B\u5BFE\u3059\u308B\u5C04\u6483\u653B\u6483\u5224\u5B9A\u306B-1\u306E\u4FEE\u6B63\u3092\u4ED8\u52A0"], [$range(5, 8, false), "\u3010\u6728\u6750\u306E\u6249\u3011\u8010\u4E45\u5EA64,\u8EFD\u6E1B\u50242,\u7279\u6B8A\u52B9\u679C:\u30B3\u30F3\u30BF\u30AF\u30C8\u5185\u306E\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC\u306B\u5BFE\u3059\u308B\u5C04\u6483\u653B\u6483\u5224\u5B9A\u306B-1\u3001\u63A5\u89E6\u5224\u5B9A\u3068\u7A81\u6483\u5224\u5B9A\u306B-2\u306E\u4FEE\u6B63\u3092\u4ED8\u52A0"], [$range(9, 12, false), "\u3010\u6728\u88FD\u5BB6\u5177\u3011\u8010\u4E45\u5EA63,\u8EFD\u6E1B\u50242,\u7279\u6B8A\u52B9\u679C:\u30B3\u30F3\u30BF\u30AF\u30C8\u5185\u3067\u884C\u308F\u308C\u308B\u683C\u95D8\u653B\u6483\u306E\u30C0\u30E1\u30FC\u30B8+1"]]), "EET": $$($nesting, 'RangeTable').$new("\u9003\u8D70\u4F53\u9A13\u8868", "1D12", [[$range(1, 3, false), "\u3010\u4F59\u88D5\u3011\u304C0\u306B\u306A\u308B"], [$range(4, 6, false), "\u4EFB\u610F\u306E\u3010\u7D46\u3011\u3092\u5408\u8A082\u70B9\u6E1B\u5C11\u3059\u308B"], [$range(7, 9, false), "\u5168\u3066\u306E\u8377\u7269\u3092\u5931\u3046\uFF08\u9003\u8D70\u3057\u305F\u30A8\u30EA\u30A2\u306B\u914D\u7F6E\u3055\u308C\u3001\u8ABF\u67FB\u3067\u767A\u898B\u53EF\u80FD\uFF09"], [$range(10, 12, false), "\u5168\u3066\u306E\u6B66\u5668\u3068\u9632\u5177\u3068\u5C0F\u9053\u5177\u3068\u8377\u7269\u3092\u5931\u3046\uFF08\u9003\u8D70\u3057\u305F\u30A8\u30EA\u30A2\u306B\u914D\u7F6E\u3055\u308C\u3001\u8ABF\u67FB\u3067\u767A\u898B\u53EF\u80FD\uFF09"]]), "GFT": $$($nesting, 'RangeTable').$new("\u98DF\u6750\u63A1\u96C6\u8868", "1D12", [[$range(1, 2, false), "\u98DF\u3079\u3089\u308C\u308B\u6839\uFF08\u6804\u990A\u4FA1:2\uFF09"], [$range(3, 5, false), "\u98DF\u3079\u3089\u308C\u308B\u8349\uFF08\u6804\u990A\u4FA1:3\uFF09"], [$range(6, 8, false), "\u98DF\u3079\u3089\u308C\u308B\u5B9F\uFF08\u6804\u990A\u4FA1:5\uFF09"], [$range(9, 10, false), "\u5C0F\u578B\u52D5\u7269\uFF08\u6804\u990A\u4FA1:10\uFF09"], [11, "\u5927\u578B\u52D5\u7269\uFF08\u6804\u990A\u4FA1:40\uFF09"], [12, "\u6C17\u6301\u3061\u60AA\u3044\u866B\uFF08\u6804\u990A\u4FA1:1\uFF09"]]), "GWT": $$($nesting, 'RangeTable').$new("\u6C34\u63A1\u96C6\u8868", "1D12", [[$range(1, 6, false), "\u6C5A\u6C34"], [$range(7, 11, false), "\u98F2\u6599\u6C34"], [12, "\u6BD2\u6C34"]]), "WST": $$($nesting, 'Table').$new("\u767D\u306E\u9B54\u77F3\u52B9\u679C\u8868", "1D12", ["\u5F79\u306B\u7ACB\u305F\u306A\u3044\u3082\u306E\u306E\u8272\u3092\u5909\u3048\u308B", "\u5F79\u306B\u7ACB\u305F\u306A\u3044\u3082\u306E\u3092\u5927\u304D\u304F\u3059\u308B", "\u5F79\u306B\u7ACB\u305F\u306A\u3044\u3082\u306E\u3092\u5C0F\u3055\u304F\u3059\u308B", "\u5F79\u306B\u7ACB\u305F\u306A\u3044\u3082\u306E\u3092\u4FDD\u5B58\u3059\u308B", "\u5F79\u306B\u7ACB\u305F\u306A\u3044\u3082\u306E\u3092\u5FA9\u5143\u3059\u308B", "\u5F79\u306B\u7ACB\u305F\u306A\u3044\u3082\u306E\u3092\u53EC\u559A\u3059\u308B", "\u5F79\u306B\u7ACB\u305F\u306A\u3044\u3082\u306E\u3092\u52D5\u304B\u3059", "\u5F79\u306B\u7ACB\u305F\u306A\u3044\u3082\u306E\u3092\u5897\u3084\u3059", "\u5F79\u306B\u7ACB\u305F\u306A\u3044\u3082\u306E\u3092\u8CBC\u308A\u4ED8\u3051\u308B", "\u5F79\u306B\u7ACB\u305F\u306A\u3044\u3082\u306E\u3092\u4F5C\u308A\u51FA\u3059", "\u5C0F\u578B\u52D5\u7269\u3092\u53EC\u559A\u3059\u308B", "\u5927\u578B\u52D5\u7269\u3092\u53EC\u559A\u3059\u308B"])}).$freeze());
    return self.$setPrefixes($rb_plus(["K[AC]\\d[-+\\d]*", "CTR"], $$($nesting, 'TABLES').$keys()));
  })($nesting[0], $$($nesting, 'DiceBot'), $nesting);
})(Opal);
